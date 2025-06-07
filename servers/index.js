const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const playersInRooms = {};

io.on('connection', (socket) => {
  console.log('🟢 Nouveau joueur connecté :', socket.id);

  socket.on('joinRoom', (roomCode, username, avatar) => {
    console.log(`joinRoom reçu: roomCode=${roomCode}, username=${username}, avatar=${avatar}`);
    socket.join(roomCode);

    if (!playersInRooms[roomCode]) playersInRooms[roomCode] = [];

    playersInRooms[roomCode].push({
      id: socket.id,
      username,
      avatar,
    });

    io.to(roomCode).emit('playerList', playersInRooms[roomCode]);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Joueur déconnecté :', socket.id);

    for (const room in playersInRooms) {
      playersInRooms[room] = playersInRooms[room].filter(p => p.id !== socket.id);
      io.to(room).emit('playerList', playersInRooms[room]);
    }
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur Socket.io lancé sur http://localhost:3001');
});
