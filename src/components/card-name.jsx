import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function CardName() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('playerList', (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off('playerList');
    };
  }, []);

  return (
    <div className="player-cards">
      {players.map((player) => (
        <div key={player.id} className="player-card">
          <img src={`/avatars/${player.avatar}`} alt="avatar" className="avatar-img" />
          <p>{player.username}</p>
        </div>
      ))}
    </div>
  );
}

export default CardName;
