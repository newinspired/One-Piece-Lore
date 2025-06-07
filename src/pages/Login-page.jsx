import { useNavigate } from 'react-router-dom';
import '../styles/login-page.scss';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:3001');

function LoginPage({ setUsername, setRoomCode }) {
  const [input, setInput] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const trimmed = input.trim();
    const trimmedRoom = roomInput.trim();

    if (trimmed.length > 0 && trimmedRoom.length > 0) {
      setUsername(trimmed);
      setRoomCode(trimmedRoom);
      localStorage.setItem('username', trimmed);
      localStorage.setItem('roomCode', trimmedRoom);
      socket.emit('joinRoom', trimmedRoom, trimmed);
      navigate(`/question/${trimmedRoom}`);
    }
  };

  /*  Nettoie le pseudo avec .trim() (enlève les espaces).
      Vérifie que le champ n’est pas vide.

      Si valide :
        met à jour le pseudo (setUsername),
        le sauvegarde dans localStorage,
        redirige vers la page /question.*/

    useEffect(() => {
        socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });
      console.log('Socket instance:', socket); 
      console.log('Socket ID initial:', socket.id);
        

        socket.on('playerJoined', (message) => {
          console.log('🔔', message);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
        });

        return () => {
          socket.off('playerJoined');
          socket.off('connect');
          socket.off('connect_error');
        };
      }, []);

  return (
    <div className="login-page">
      <div className='modal-login'>
        <h2>Ecris ton nom ci-dessous :</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="NAME"
        />
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Ex: onepiece123"
        />
        <button onClick={handleSubmit}>Rejoindre</button>
      </div>
    </div>
  );
}

export default LoginPage;