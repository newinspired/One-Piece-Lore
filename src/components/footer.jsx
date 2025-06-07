import '../styles/footer.scss'
import illustrationFooter from '../assets/illustration-chapitre-1023.png'
import leftImage from '../assets/left-image.jpg'
import rightImage from '../assets/right-image.jpg'


const Footer = () => {
return (
    <footer>
        <div className='footer-separate'></div>
        <div className='footer'>
            <img src={illustrationFooter} alt='Les mugiwara'></img>
            <h3>Réalisé par Aurélien</h3>
            <img src ={leftImage} alt='caca'></img>
            <img src={rightImage} alt='caca'></img>
        </div>
    </footer>
    )
}

export default Footer