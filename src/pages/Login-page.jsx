import { useNavigate } from 'react-router-dom';
import '../styles/login-page.scss';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import socket from '../socket';

// Avatars importés
import luffy from '../../public/avatars/luffy.jpg';
import rayleighAvatar from '../../public/avatars/rayleigh-avatar.jpg';
import trafalgarLaw from '../../public/avatars/trafalgar-law-manga.jpg';
import shanksAvatar from '../../public/avatars/shanks-manga.jpg';
import hancock from '../../public/avatars/hancock-manga.jpg';
import sanji from '../../public/avatars/sanji.jpg';
import mihawk from '../../public/avatars/mihawk.jpg';
import nami from '../../public/avatars/nami.jpg';
import zoro from '../../public/avatars/zoro-wano.jpg';
import robin from '../../public/avatars/robin.jpg';

function LoginPage({ setUsername, setRoomCode }) {
  const navigate = useNavigate();
  

  const avatarOptions = [
    { name: 'Luffy', src: luffy },
    { name: 'Zoro', src: zoro },
    { name: 'Nami', src: nami },
    { name: 'Sanji', src: sanji },
    { name: 'Robin', src: robin },
    { name: 'Shanks', src: shanksAvatar },
    { name: 'Rayleigh', src: rayleighAvatar },
    { name: 'Trafalgar Law', src: trafalgarLaw },
    { name: 'Hancock', src: hancock },
    { name: 'Mihawk', src: mihawk },
  ];

  const [input, setInput] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].name);
  const isFormValid = input.trim() !== '' && roomInput.trim() !== '';

  const handleSubmit = () => {
    const trimmed = input.trim();
    const trimmedRoom = roomInput.trim();

    if (trimmed && trimmedRoom) {
      const avatarObj = avatarOptions.find(a => a.name === selectedAvatar);
      setUsername(trimmed);
      setRoomCode(trimmedRoom);

      // Sauvegarde dans localStorage
      localStorage.setItem('username', trimmed);
      localStorage.setItem('roomCode', trimmedRoom);
      localStorage.setItem('avatar', selectedAvatar);

      // Envoie les infos au serveur
      const avatarFilename = avatarObj.src.split('/').pop(); // extrait 'luffy.jpg'
      socket.emit('joinRoom', trimmedRoom, trimmed, avatarFilename);

      // Redirection
      navigate(`/question/${trimmedRoom}`, {
      state: {
        username: trimmed,
        avatar: avatarFilename,
      }
});
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket connecté:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion socket:', err);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  return (
    <div className="login-page">
      <div className="modal-login">
        <h3>ONE PIECE LORE</h3>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nom"
          maxLength={10}
        />

        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Code de la partie"
          maxLength={10}
        />

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
        </div>

        <button onClick={handleSubmit} disabled={!isFormValid}>Rejoindre</button>
      </div>
    </div>
  );
}

export default LoginPage;