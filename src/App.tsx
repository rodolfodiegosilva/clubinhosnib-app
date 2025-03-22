import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Event from './pages/Event/Event';
import Home from './pages/Home/Home';
import Navbar from './components/NavBar/Navbar';
import './styles/Global.css';
import Feed from './pages/Feed/Feed';
import SelecPageTemplate from './pages/PageCreator/SelectPageTemplate/SelecPageTemplate';
import Footer from './components/Footer/Footer';
import Gallery from './pages/PageCreator/Templates/PhotosGallery/Gallery';

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
          <Route path="/feed-clubinho" element={<Feed />} />
          <Route path="/editar-feed-clubinho" element={<Gallery />} />
          <Route path="/dynamic-page" element={<SelecPageTemplate />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
