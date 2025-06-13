import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/game-page.scss';
import socket from '../socket';
import GameModeQuestion from '../components/game-mode-question.jsx'

function GamePage() {
  const { room } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // 🔽 Tu peux récupérer 25 questions depuis le back, ou les charger ici
    socket.emit('requestQuestions', room); // Optionnel si serveur fournit

    socket.on('questionsList', (questionList) => {
      setQuestions(questionList.slice(0, 25)); // Limite à 25
    });

    return () => {
      socket.off('questionsList');
    };
  }, [room]);

  return (
    <div className="container-game">
      <GameModeQuestion />
    </div>
  );
}

export default GamePage;