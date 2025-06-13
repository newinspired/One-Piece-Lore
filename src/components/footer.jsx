import '../styles/footer.scss'
import illustrationFooter from '../assets/header-footer/illustration-chapitre-1023.png'



const Footer = () => {
return (
    <footer>
        <div className='footer-separate'></div>
        <div className='footer'>
            <img src={illustrationFooter} alt='Les mugiwara'></img>
        </div>
    </footer>
    )
}

export default Footer