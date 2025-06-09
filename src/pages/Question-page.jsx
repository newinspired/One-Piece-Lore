import { useParams, useLocation ,useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CardName from '../components/card-name.jsx';
import WaitingRoom from '../components/ready-button.jsx';
import GameMode from '../components/game-mode.jsx';
import socket from '../socket';
import '../styles/card-name.scss';
import '../styles/question-page.scss';

function QuestionPage() {
  const { room } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { username, avatar } = location.state || {};
  const [selectedMode, setSelectedMode] = useState(null);

  useEffect(() => {
    if (username && avatar) {
      socket.emit('joinRoom', room, username, avatar);
    }
  }, [room, username, avatar]);

  useEffect(() => {
  const handleStartGame = () => {
    navigate(`/game/${room}`);
  };

  socket.on('startGame', handleStartGame);

  return () => {
    socket.off('startGame', handleStartGame);
  };
}, [room, navigate]);

  return (
    <div className='container'>
      <div className='container-bonne-chance'>
        <CardName />
      </div>
      <div className='container-waiting'>
        <WaitingRoom roomCode={room} username={username} selectedMode={selectedMode}/>
      </div>
      <GameMode roomCode={room} username={username} setSelectedMode={setSelectedMode} />

    </div>
  );
}

export default QuestionPage;