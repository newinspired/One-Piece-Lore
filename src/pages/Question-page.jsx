import { useParams } from 'react-router-dom';

function QuestionPage({ username }) {
  const { room } = useParams(); // récupère le code du salon depuis l'URL

  return (
    <div>
      <h2>Bienvenue {username} dans le salon {room} !</h2>
      {/* ici tu pourras afficher les questions de ce salon */}
    </div>
  );
}

export default QuestionPage;