const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const playersInRooms = {}; // roomCode => [ { id, username, avatar, isReady, isHost } ]

io.on('connection', (socket) => {
  console.log('🟢 Nouveau joueur connecté :', socket.id);

  socket.on('joinRoom', (roomCode, username, avatar) => {
    console.log(`📩 joinRoom reçu: roomCode=${roomCode}, username=${username}, avatar=${avatar}`);

    socket.join(roomCode);

    if (!playersInRooms[roomCode]) {
      playersInRooms[roomCode] = [];
    }

    // Cherche si le joueur est déjà dans la room (reconnexion)
    let isHost = false;
    const existingPlayerIndex = playersInRooms[roomCode].findIndex(p => p.id === socket.id);

    if (existingPlayerIndex === -1) {
      // Nouveau joueur
      isHost = playersInRooms[roomCode].length === 0; // Premier joueur = host
      playersInRooms[roomCode].push({
        id: socket.id,
        username,
        avatar,
        isReady: false,
        isHost,
      });
    } else {
      // Joueur existant (reconnexion ou rafraîchissement)
      const existingPlayer = playersInRooms[roomCode][existingPlayerIndex];
      playersInRooms[roomCode][existingPlayerIndex] = {
        ...existingPlayer,
        username,
        avatar,
        isReady: false,
        // NE PAS modifier isHost ici pour conserver le statut
        isHost: existingPlayer.isHost,
      };
      isHost = existingPlayer.isHost;
    }

    // En cas d'absence totale de host, on force le premier joueur à être host
    const hasHost = playersInRooms[roomCode].some(p => p.isHost);
    if (!hasHost && playersInRooms[roomCode].length > 0) {
      playersInRooms[roomCode][0].isHost = true;
      if (playersInRooms[roomCode][0].id === socket.id) {
        isHost = true;
      }
    }

    console.log(`👥 Room ${roomCode} →`, playersInRooms[roomCode]);
    console.log('🧍 État des joueurs après joinRoom :', playersInRooms[roomCode]);

    // Envoie la liste des joueurs à tous dans la room
    io.to(roomCode).emit('playerList', playersInRooms[roomCode]);

    // Informe CE joueur s’il est host
    socket.emit('hostStatus', isHost);
  });

  socket.on('playerReady', (roomCode, isReady) => {
    if (!playersInRooms[roomCode]) return;

    const player = playersInRooms[roomCode].find(p => p.id === socket.id);
    if (player) {
      player.isReady = isReady;
      console.log(`🔄 playerReady reçu pour ${socket.id} dans la room ${roomCode} :`, isReady);
    }

    io.to(roomCode).emit('playerList', playersInRooms[roomCode]);

    const allReady = playersInRooms[roomCode].length > 0 &&
      playersInRooms[roomCode].every(p => p.isReady);
    if (allReady) {
      io.to(roomCode).emit('startGame');
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Joueur déconnecté :', socket.id);

    for (const roomCode in playersInRooms) {
      const room = playersInRooms[roomCode];
      const wasHost = room.find(p => p.id === socket.id)?.isHost;

      playersInRooms[roomCode] = room.filter(p => p.id !== socket.id);

      // 🔁 Transférer le host s'il est parti
      if (wasHost && playersInRooms[roomCode].length > 0) {
        // Le premier joueur devient host
        playersInRooms[roomCode][0].isHost = true;

        // Les autres perdent le statut host
        for (let i = 1; i < playersInRooms[roomCode].length; i++) {
          playersInRooms[roomCode][i].isHost = false;
        }

        // Informer le nouveau host directement
        io.to(playersInRooms[roomCode][0].id).emit('hostStatus', true);
      }

      // Mise à jour de la liste pour la room
      io.to(roomCode).emit('playerList', playersInRooms[roomCode]);
      console.log(`📤 Liste mise à jour envoyée à la room ${roomCode}`);
    }
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur Socket.io lancé sur http://localhost:3001');
});
