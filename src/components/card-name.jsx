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
      {players.map((player) => (
        <div key={player.id} className="card-name">
          <p>{player.username}</p>
          <img src={`/avatars/${player.avatar}`} alt={player.username} className="avatar-img" />
        </div>
      ))}
    </div>
  );
}

export default CardName;
