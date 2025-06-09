import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/game-page.scss';
import socket from '../socket';

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
      <h2>🎮 Partie lancée !</h2>
      {questions.length === 0 ? (
        <p>Chargement des questions...</p>
      ) : (
        <ul>
          {questions.map((q, index) => (
            <li key={index}>
              <strong>Q{index + 1}:</strong> {q.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GamePage;