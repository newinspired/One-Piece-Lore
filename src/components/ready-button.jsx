import { useState, useEffect } from 'react';
import socket, { sendPlayerReady, onPlayerListUpdate, offPlayerListUpdate } from '../socket';
import '../styles/ready-button.scss';

function WaitingRoom({ roomCode, username, selectedMode }) {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Écoute les mises à jour des joueurs
    onPlayerListUpdate((updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

        // 🔥 Quand tous les joueurs sont prêts
    socket.on('allPlayersReady', () => {
      navigate(`/game/${roomCode}`); // Redirige vers la page de jeu
    });
    
    return () => {
      offPlayerListUpdate();
    };
  }, []);

  const handleReadyClick = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    sendPlayerReady(roomCode, newReadyState);
  };

  return (
    <div className='container-ready-button'>
      <h2>Salle d’attente n°{roomCode}</h2>
      <span>
        <span className='couleur-pseudo'>{username}</span>, choisis un mode de jeu et clique sur le bouton quand tu es prêt !
      </span>

      <button
        onClick={handleReadyClick}
        disabled={!selectedMode}
        className={!selectedMode ? 'disabled-button' : ''}
      >
        {isReady ? 'Prêt ✔️' : 'En attente...'}
      </button>

    </div>
  );
}

export default WaitingRoom;