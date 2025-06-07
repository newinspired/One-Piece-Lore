const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // autorise tous les clients
});

io.on('connection', (socket) => {
  console.log('🟢 Nouveau joueur connecté :', socket.id);

  socket.on('joinRoom', (roomCode, username) => {
    console.log(`joinRoom reçu: roomCode=${roomCode}, username=${username}`);
    socket.join(roomCode);
    io.to(roomCode).emit('playerJoined', `${username} a rejoint le salon`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Joueur déconnecté :', socket.id);
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur Socket.io lancé sur http://localhost:3001');
});