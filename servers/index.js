const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// roomCode => [ { id, username, avatar, isReady } ]
const playersInRooms = {};

io.on('connection', (socket) => {
  console.log('🟢 Nouveau joueur connecté :', socket.id);

  socket.on('joinRoom', (roomCode, username, avatar) => {
    console.log(`📩 joinRoom reçu: roomCode=${roomCode}, username=${username}, avatar=${avatar}`);
    socket.join(roomCode);

    if (!playersInRooms[roomCode]) {
      playersInRooms[roomCode] = [];
    }

    // Évite doublons, met à jour ou ajoute le joueur
    const existingPlayerIndex = playersInRooms[roomCode].findIndex(p => p.id === socket.id);
    if (existingPlayerIndex === -1) {
      playersInRooms[roomCode].push({
        id: socket.id,
        username,
        avatar,
        isReady: false,  // prêt initial à false
      });
    } else {
      playersInRooms[roomCode][existingPlayerIndex] = {
        ...playersInRooms[roomCode][existingPlayerIndex],
        username,
        avatar,
      };
    }

    io.to(roomCode).emit('playerList', playersInRooms[roomCode]);
  });

  // Gère la mise à jour du statut ready
  socket.on('playerReady', (roomCode, isReady) => {
    if (!playersInRooms[roomCode]) return;

    const player = playersInRooms[roomCode].find(p => p.id === socket.id);
    if (player) {
      player.isReady = isReady;
    }

    io.to(roomCode).emit('playerList', playersInRooms[roomCode]);

    // Si tous prêts, lance la partie
    const allReady = playersInRooms[roomCode].length > 0 &&
                     playersInRooms[roomCode].every(p => p.isReady);
    if (allReady) {
      io.to(roomCode).emit('startGame');
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Joueur déconnecté :', socket.id);
    for (const roomCode in playersInRooms) {
      const before = playersInRooms[roomCode].length;
      playersInRooms[roomCode] = playersInRooms[roomCode].filter(p => p.id !== socket.id);
      const after = playersInRooms[roomCode].length;
      if (before !== after) {
        io.to(roomCode).emit('playerList', playersInRooms[roomCode]);
        console.log(`📤 Liste mise à jour envoyée à la room ${roomCode}`);
      }
    }
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur Socket.io lancé sur http://localhost:3001');
});