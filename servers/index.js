const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// roomCode => [ { id, username, avatar } ]
const playersInRooms = {};

io.on('connection', (socket) => {
  console.log('🟢 Nouveau joueur connecté :', socket.id);

  socket.on('joinRoom', (roomCode, username, avatar) => {
    console.log(`📩 joinRoom reçu: roomCode=${roomCode}, username=${username}, avatar=${avatar}`);
    socket.join(roomCode);

    if (!playersInRooms[roomCode]) {
      playersInRooms[roomCode] = [];
    }

    // Évite les doublons : remplace le joueur existant s’il est déjà là
    const alreadyInRoom = playersInRooms[roomCode].some(p => p.id === socket.id);
    if (!alreadyInRoom) {
      playersInRooms[roomCode].push({
        id: socket.id,
        username,
        avatar,
      });
    }

    // 🔁 Envoie à tous les joueurs de la room la liste actualisée
    io.to(roomCode).emit('playerList', playersInRooms[roomCode]);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Joueur déconnecté :', socket.id);

    for (const roomCode in playersInRooms) {
      const before = playersInRooms[roomCode].length;

      playersInRooms[roomCode] = playersInRooms[roomCode].filter(
        (player) => player.id !== socket.id
      );

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