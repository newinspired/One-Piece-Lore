import { useNavigate } from 'react-router-dom';
import '../styles/login-page.scss';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

import luffy from '../assets/avatars/luffy.jpg';
import rayleighAvatar from '../assets/avatars/rayleigh-avatar.jpg'
import trafalgarLaw from '../assets/avatars/trafalgar-law-manga.jpg'
import shanksAvatar from '../assets/avatars/shanks-manga.jpg'
import hancock from '../assets/avatars/hancock-manga.jpg'
import sanji from '../assets/avatars/sanji.jpg'
import mihawk from '../assets/avatars/mihawk.jpg'
import nami from '../assets/avatars/nami.jpg'
import zoro from '../assets/avatars/zoro.jpg'
import robin from '../assets/avatars/robin.jpg'


const socket = io('http://localhost:3001');

function LoginPage({ setUsername, setRoomCode }) {
  const [input, setInput] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const navigate = useNavigate();

  const avatarOptions = [
    { name: 'Luffy', src: luffy },
    { name: 'zoro', src:zoro},
    { name: 'Nami', src:nami},
    { name: 'Sanji', src:sanji},
    { name: 'Robin', src:robin},

    { name: 'Shanks', src:shanksAvatar},
    { name: 'Rayleigh', src:rayleighAvatar},
    { name: 'Trafalgar Law', src:trafalgarLaw},
    { name: 'hancock', src:hancock},
    { name: 'Mihawk', src:mihawk},

  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].name);

  const handleSubmit = () => {
    const trimmed = input.trim();
    const trimmedRoom = roomInput.trim();

    if (trimmed.length > 0 && trimmedRoom.length > 0) {
      setUsername(trimmed);
      setRoomCode(trimmedRoom);
      localStorage.setItem('username', trimmed);
      localStorage.setItem('roomCode', trimmedRoom);
      localStorage.setItem('avatar', selectedAvatar);
      socket.emit('joinRoom', trimmedRoom, trimmed, selectedAvatar);
      navigate(`/question/${trimmedRoom}`);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  return (
    <div className="login-page">
      <div className="modal-login">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="NOM"
        />
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="NOM DU SALON"
        />

        <h3>Choisis ton avatar :</h3>
        <div className="avatar-choose">
          {avatarOptions.map(({ name, src }) => (
            <img
              key={name}
              src={src}
              alt={name}
              className={`avatar-thumb ${selectedAvatar === name ? 'selected' : ''}`}
              onClick={() => setSelectedAvatar(name)}
            />
          ))}
          <button onClick={handleSubmit}>Rejoindre</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;