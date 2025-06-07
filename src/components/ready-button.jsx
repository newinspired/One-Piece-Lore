import { useState, useEffect } from 'react';
import socket, { sendPlayerReady, onPlayerListUpdate, offPlayerListUpdate } from '../socket';

function WaitingRoom({ roomCode, username }) {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Écoute la mise à jour des joueurs depuis le serveur
    onPlayerListUpdate((updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Nettoyage à la destruction du composant
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
    <div>
      <h2>Salle d’attente - {roomCode}</h2>
      <p>Bonjour {username}, clique sur le bouton quand tu es prêt !</p>
      
      <button onClick={handleReadyClick}>
        {isReady ? 'Prêt ✔️' : 'Je suis prêt'}
      </button>

      <h3>Liste des joueurs :</h3>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.username} {player.isReady ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WaitingRoom;