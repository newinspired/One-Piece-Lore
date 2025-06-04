import { Link } from 'react-router-dom'
import '../styles/header.scss'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">One Piece Lore</Link>
      </div>
      <nav className="nav">
        <Link to="/">Accueil</Link>
        <Link to="/personnages">Personnages</Link>
      </nav>
    </header>
  )
}

export default Header