import { useState } from 'react';
import questionsData from '../stockage/EastBlueToWaterSeven.json';
import '../styles/question.scss'; 

const Question = () => {
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
    <div className="container-question-component">
      {currentQuestion.imageUrl ? (
        <div className="question-image">
          <img src={currentQuestion.imageUrl} alt="Illustration de la question" />
        </div>
      ) : (
        <div className="question-image empty"></div>
      )}
    
      <div className="container-question">
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
      </div>
      <div className="container-ranking">

      </div>
    </div>
  );
};

export default Question;