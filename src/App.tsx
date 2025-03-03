import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Event from './pages/Event/Event';
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer';
import './styles/Global.css';
import Home from './pages/Home/Home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/eventos" element={<Event />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
