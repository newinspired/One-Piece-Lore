import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CardName from '../components/card-name.jsx';
import WaitingRoom from '../components/ready-button.jsx';
import GameMode from '../components/game-mode.jsx'
import { io } from 'socket.io-client';
import socket from '../socket';
import '../styles/card-name.scss';
import '../styles/question-page.scss'

function QuestionPage() {
  const { room } = useParams();
  const location = useLocation();
  const { username, avatar } = location.state || {};

  useEffect(() => {
    if (username && avatar) {
      socket.emit('joinRoom', room, username, avatar);
    }
  }, [room, username, avatar]);

return (
  <div className='container'>
    <div className='container-bonne-chance'>
      <div>
        <h2>Bonne chance <span className='nom-couleur'>{username}</span>!</h2>
      </div>
      <div>
        <CardName />
      </div>
    </div>
    <div className='container-waiting'>
        <WaitingRoom />
    </div>
    
    <GameMode />
    
  </div>
);
}

export default QuestionPage;