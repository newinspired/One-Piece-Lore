import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/question.scss';
import socket from '../socket';
import Question from '../components/question.jsx'

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
    <div>
      <Question />
    </div>
  );
}

export default GamePage;