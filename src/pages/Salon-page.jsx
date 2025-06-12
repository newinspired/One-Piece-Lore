

import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import CardName from '../components/card-name.jsx';
import WaitingRoom from '../components/ready-button.jsx';
import GameMode from '../components/game-mode.jsx';
import socket from '../socket.js';
import '../styles/card-name.scss';
import '../styles/salon-page.scss';

function QuestionPage() {
  const { room } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { username, avatar } = location.state || {};

  const [selectedMode, setSelectedMode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const hasJoinedRef = useRef(false); // ✅ Pour éviter double `joinRoom`

  // ✅ Join room — évite les doublons
  useEffect(() => {
    const handleConnect = () => {
      console.log('📡 Connecté avec socket.id :', socket.id);
      if (username && avatar && !hasJoinedRef.current) {
        socket.emit('joinRoom', room, username, avatar);
        hasJoinedRef.current = true; // Empêche un second envoi
        console.log('📨 Envoi unique de joinRoom');
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.once('connect', handleConnect);
    }

    return () => {
      socket.off('connect', handleConnect);
    };
  }, [room, username, avatar]);

  // 🔍 Écoute si on est host
  useEffect(() => {
    const handleHostStatus = (isHost) => {
      setIsHost(isHost);
      console.log('👑 Suis-je le host ? →', isHost);
    };

    socket.on('hostStatus', handleHostStatus);

    return () => {
      socket.off('hostStatus', handleHostStatus);
    };
  }, []);

  // 🎮 Écoute lancement du jeu
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
    <div className="container">
      <div className="container-bonne-chance">
        <CardName currentSocketId={socket.id}/>
      </div>
      <div className="container-waiting">
        <WaitingRoom roomCode={room} username={username} selectedMode={selectedMode} />
      </div>
      <GameMode
        roomCode={room}
        username={username}
        setSelectedMode={setSelectedMode}
        isHost={isHost}
        currentSocketId={socket.id}
      />
    </div>
  );
}

export default QuestionPage;