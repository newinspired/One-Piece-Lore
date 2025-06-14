import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:3001');

const Question = ({ username, avatar }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const { roomCode } = useParams();

  useEffect(() => {
    socket.emit('joinRoom', {
      roomId: roomCode,
      username,
      avatar,
    });

    // ✅ Pour les tests : auto-ready
    socket.emit('playerReady', roomCode, true);

    socket.on('hostStatus', (hostStatus) => setIsHost(hostStatus));
    socket.on('playerList', (playersList) => setPlayers(playersList));

    socket.on('startGame', () => {
      console.log('✅ Événement startGame reçu (le jeu commence)');
      // Rien à faire ici si la question suit juste après
    });

    socket.on('newQuestion', ({ question, timeLeft }) => {
      console.log('📨 newQuestion reçu:', question, timeLeft);
      setCurrentQuestion(question);
      setTimeLeft(timeLeft);
      setUserAnswer('');
      setFeedback('');
    });

    socket.on('timer', (time) => setTimeLeft(time));

    socket.on('questionEnded', ({ correctAnswer, scores }) => {
      if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        setFeedback('✅ Bonne réponse !');
      } else {
        setFeedback(`❌ Mauvaise réponse. Réponse attendue : ${correctAnswer}`);
      }
      const player = players.find((p) => p.id === socket.id);
      setScore(scores?.[player?.id] || 0);
    });

    socket.on('gameEnded', () => {
      alert(`🎉 Fin du quiz ! Score total : ${score} berries`);
    });

    return () => {
      socket.off('hostStatus');
      socket.off('playerList');
      socket.off('startGame');
      socket.off('newQuestion');
      socket.off('timer');
      socket.off('questionEnded');
      socket.off('gameEnded');
    };
  }, [roomCode, username, avatar, userAnswer, score]);

  const handleChange = (e) => {
    setUserAnswer(e.target.value);
    socket.emit('playerAnswer', roomCode, e.target.value);
  };

  if (!currentQuestion) return <p>Chargement...</p>;

  return (
    <div className="container-question-component">
      {currentQuestion.imageUrl ? (
        <div className="question-image">
          <img src={currentQuestion.imageUrl} alt="Illustration de la question" />
        </div>
      ) : (
        <div className="question-image empty"></div>
      )}

      <div className="container-question">
        <div className="timer">Temps restant : {timeLeft}</div>
        <p className="question-text">{currentQuestion.question}</p>

        <input
          type="text"
          value={userAnswer}
          onChange={handleChange}
          placeholder="Tape ta réponse ici"
          disabled={timeLeft === 0}
          autoFocus
        />

        {feedback && <div className="feedback">{feedback}</div>}
      </div>

      <div className="container-ranking">
        <h4>Joueurs :</h4>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              {p.username} {p.isHost ? '(Host)' : ''} - {p.score || 0} berries
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Question;