import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavLinks: React.FC<{ closeMenu?: () => void }> = ({ closeMenu }) => {
  const location = useLocation();

  const handleClick = () => {
    if (closeMenu) closeMenu();
  };

  return (
    <ul className="nav-links">
      <li className={location.pathname === '/' ? 'active' : ''}>
        <Link to="/" onClick={handleClick}>Início</Link>
      </li>      
      <li className={location.pathname === '/feed-clubinho' ? 'active' : ''}>
        <Link to="/feed-clubinho" onClick={handleClick}>Feed Clubinho</Link>
      </li>
      <li className={location.pathname === '/sobre' ? 'active' : ''}>
        <Link to="/sobre" onClick={handleClick}>Sobre</Link>
      </li>
      <li className={location.pathname === '/eventos' ? 'active' : ''}>
        <Link to="/eventos" onClick={handleClick}>Eventos</Link>
      </li>
      <li className={location.pathname === '/contato' ? 'active' : ''}>
        <Link to="/contato" onClick={handleClick}>Contato</Link>
      </li>
      <li className={location.pathname === '/dynamic-page' ? 'active' : ''}>
        <Link to="/dynamic-page" onClick={handleClick}>Dynamic Page</Link>
      </li>
    </ul>
  );
};

export default NavLinks;
