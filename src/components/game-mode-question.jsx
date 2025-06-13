

import { useState } from 'react';
import questionsData from '../stockage/EastBlueToWaterSeven.json';
import '../styles/game-page.scss'; 

const GameModeQuestion = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const currentQuestion = questionsData[currentIndex];

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctAnswer = currentQuestion.answer.trim().toLowerCase();
    const userResponse = userAnswer.trim().toLowerCase();

    if (userResponse === correctAnswer) {
      setFeedback('✅ Bonne réponse !');
      setScore(score + currentQuestion.pointsBerry);
    } else {
      setFeedback(`❌ Mauvaise réponse. Réponse attendue : ${currentQuestion.answer}`);
    }

    setTimeout(() => {
      setFeedback('');
      setUserAnswer('');
      if (currentIndex < questionsData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert(`🎉 Fin du quiz ! Score total : ${score} berries`);
      }
    }, 2000);
  };

  return (
    <div className="container-question">
      <h2>Question {currentIndex + 1} / {questionsData.length}</h2>
      <p className="question-text">{currentQuestion.question}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Ta réponse"
          required
        />
        <button type="submit">Valider</button>
      </form>

      {feedback && <p className="feedback">{feedback}</p>}
      <p className="score">Berries : {score}</p>
    </div>
  );
};

export default GameModeQuestion;