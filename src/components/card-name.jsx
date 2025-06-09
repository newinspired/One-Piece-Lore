import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../styles/card-name.scss'
import socket from '../socket';

function CardName() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {

    socket.on('playerList', (players) => {
      console.log('🧩 players reçus :', players);
      setPlayers(players);
    });

    return () => {
      socket.off('playerList');
    };
  }, []);

  return (
  <div className="container-card-name">
    {players.map((player) => {
      console.log(`🎯 Statut readiness - ${player.username} (${player.id}):`, player.isReady);

      return (
        <div key={player.id} className="player-wrapper">
          <div className="card-name">
            <p>{player.username}</p>
            <img
              src={`/avatars/${player.avatar}`}
              alt={player.username}
              className="avatar-img"
            />
          </div>
          <span className="ready-status">
            {typeof player.isReady === 'boolean' && player.isReady ? '✅ Prêt' : '❌ Pas prêt'}
          </span>
        </div>
      );
    })}
  </div>
);
}

export default CardName;
