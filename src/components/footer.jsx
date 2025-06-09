import '../styles/footer.scss'
import illustrationFooter from '../assets/illustration-chapitre-1023.png'
import leftImage from '../assets/left-image.jpg'
import rightImage from '../assets/right-image.jpg'
import chapitre1054 from '../assets/chapitre-1054.jpg'
import chapitre1133 from '../assets/chapitre-1103.jpg'


const Footer = () => {
return (
    <footer>
        <div className='footer-separate'></div>
        <div className='footer'>
            <div className='chapter1031'>
                <img src ={leftImage} alt='caca'></img>
                <img src={rightImage} alt='caca'></img>
            </div>
            <img src={chapitre1054} alt='Les empereurs'></img>
            <img src={illustrationFooter} alt='Les mugiwara'></img>

            
        </div>
    </footer>
    )
}

export default Footer