import '../styles/header.scss'
import backgroundHeader from '../assets/ocean-background.jpg'

const Header = () => {
  return (
    <header>
      <div className="header">
        <img src={backgroundHeader} alt='Illustration du chapitre 1023'></img>
      </div>
      <div className='header-separate'></div>
    </header>

  )
}

export default Header