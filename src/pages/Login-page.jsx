import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login-page.scss';

function LoginPage({ setUsername }) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed.length > 0) {
      setUsername(trimmed);
      localStorage.setItem('username', trimmed); // Optionnel : pour retenir après rechargement
      navigate('/question'); // Redirige vers la page du quiz
    }
  };

  return (
    <div className="login-page">
      <h2>Bienvenue sur One Piece Lore Quiz</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Entrez votre pseudo"
      />
      <button onClick={handleSubmit}>Commencer</button>
    </div>
  );
}

export default LoginPage;