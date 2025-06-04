import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;