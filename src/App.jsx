import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import LoginPage from './pages/Login-page.jsx'
import Footer from './components/footer.jsx'
import QuestionPage from ''


function App() {

  const [username, setUsername] = useState('');

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/quiz" element={<QuestionPage username={username} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;