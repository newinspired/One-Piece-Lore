const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const questions = require('../src/stockage/EastBlueToWaterSeven.json');

const playersInRooms = {}; 
const games = {}; 
function startGameForRoom(roomCode) {
  if (!playersInRooms[roomCode]) return;

  console.log(`🎮 Démarrage du jeu pour la room ${roomCode}`);

  const gameState = {
    currentIndex: 0
  };
  games[roomCode] = gameState;
}


function startGameForRoom(roomCode) {
  if (!playersInRooms[roomCode] || playersInRooms[roomCode].length === 0) return;

  const gameState = {
    currentIndex: 0,
    intervalId: null,
    countdown: 15,
    acceptingAnswers: true,
  };
  games[roomCode] = gameState;

  const emitQuestion = () => {
    if (gameState.currentIndex >= questions.length) {
      io.to(roomCode).emit('gameEnded');
      delete games[roomCode];
      return;
    }

    const currentQuestion = questions[gameState.currentIndex];

    // Reset players' lastAnswer and acceptingAnswers flag
    playersInRooms[roomCode].forEach((player) => {
      player.lastAnswer = '';
    });
    gameState.acceptingAnswers = true;
    gameState.countdown = 15;

    io.to(roomCode).emit('newQuestion', {
      question: currentQuestion,
      timeLeft: gameState.countdown,
    });

    // Timer countdown
    if (gameState.intervalId) clearInterval(gameState.intervalId);

    gameState.intervalId = setInterval(() => {
      gameState.countdown--;

      io.to(roomCode).emit('timer', gameState.countdown);

      if (gameState.countdown <= 0) {
        clearInterval(gameState.intervalId);
        gameState.acceptingAnswers = false;

        if (typeof currentQuestion.answer !== 'string') {
          console.error('❌ currentQuestion.answer n\'est pas une chaîne :', currentQuestion.answer);
          return;
}
        // Calcul des scores
        const correctAnswer = currentQuestion.answer.trim().toLowerCase();
        playersInRooms[roomCode].forEach((player) => {
          const answer = (player.lastAnswer || '').trim().toLowerCase();
          if (answer === correctAnswer) {
            player.score = (player.score || 0) + (currentQuestion.pointsBerry || 0);
          }
        });

        // Préparation scores à envoyer (id => score)
        const scores = {};
        playersInRooms[roomCode].forEach((p) => {
          scores[p.id] = p.score || 0;
        });

        io.to(roomCode).emit('questionEnded', {
          correctAnswer: currentQuestion.answer,
          scores,
        });

        // Pause 5 secondes puis question suivante
        setTimeout(() => {
          gameState.currentIndex++;
          emitQuestion();
        }, 5000);
      }
    }, 1000);
  };

  emitQuestion();
}

io.on('connection', (socket) => {
  console.log('🔌 Joueur connecté :', socket.id);

  socket.on('joinRoom', ({ roomId, username, avatar }) => {
    console.log(`👉 Rejoint la room ${roomId} :`, username, socket.id);
    socket.join(roomId);

    if (!playersInRooms[roomId]) playersInRooms[roomId] = [];

    let isHost = false;
    const existingPlayerIndex = playersInRooms[roomId].findIndex(p => p.id === socket.id);

    if (existingPlayerIndex === -1) {
      isHost = playersInRooms[roomId].length === 0; 
      playersInRooms[roomId].push({
        id: socket.id,
        username,
        avatar,
        isReady: false,
        isHost,
        score: 0,
        lastAnswer: '',
      });
    } else {
      // Joueur déjà présent (reconnexion)
      const existingPlayer = playersInRooms[roomId][existingPlayerIndex];
      playersInRooms[roomId][existingPlayerIndex] = {
        ...existingPlayer,
        username,
        avatar,
        isReady: false,
        isHost: existingPlayer.isHost,
      };
      isHost = existingPlayer.isHost;
    }

    // Vérifier s'il y a un host sinon assigner
    const hasHost = playersInRooms[roomId].some(p => p.isHost);
    if (!hasHost && playersInRooms[roomId].length > 0) {
      playersInRooms[roomId][0].isHost = true;
      if (playersInRooms[roomId][0].id === socket.id) {
        isHost = true;
      }
    }

    io.to(roomId).emit('playerList', playersInRooms[roomId]);
    socket.emit('hostStatus', isHost);

    console.log(`📥 Room ${roomId} joueurs:`, playersInRooms[roomId]);
  });

  socket.on('playerAnswer', (roomCode, answer) => {
    if (!playersInRooms[roomCode] || !games[roomCode]) return;

    const player = playersInRooms[roomCode].find(p => p.id === socket.id);
    if (!player) return;

    const gameState = games[roomCode];
    if (!gameState.acceptingAnswers) return; // Fin du temps, plus d'acceptation

    player.lastAnswer = answer; // stocke la dernière réponse

    // Pas besoin d’envoyer la liste à chaque réponse, ça fait trop de trafic
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

    if (allReady && !games[roomCode]) {
      console.log(`🚀 Tous les joueurs sont prêts dans la room ${roomCode}, démarrage du jeu.`);
      io.to(roomCode).emit('startGame');
      startGameForRoom(roomCode);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Joueur déconnecté :', socket.id);

    for (const roomCode in playersInRooms) {
      const room = playersInRooms[roomCode];
      const wasHost = room.find(p => p.id === socket.id)?.isHost;

      playersInRooms[roomCode] = room.filter(p => p.id !== socket.id);

      if (wasHost && playersInRooms[roomCode].length > 0) {
        playersInRooms[roomCode][0].isHost = true;
        for (let i = 1; i < playersInRooms[roomCode].length; i++) {
          playersInRooms[roomCode][i].isHost = false;
        }
        io.to(playersInRooms[roomCode][0].id).emit('hostStatus', true);
      }

      io.to(roomCode).emit('playerList', playersInRooms[roomCode]);
      console.log(`📤 Room ${roomCode} liste joueurs mise à jour`);
    }
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur Socket.io lancé sur http://localhost:3001');
});