import React from 'react';
import MobileNavigation from './MobileNavigation';
import './NavBar.css';
import DesktopNavigation from './DesktopNavigation';

const NavBar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="logo">
        <a href="/">Clubinhos NIB</a>
      </div>
      <DesktopNavigation />
      <MobileNavigation />
    </header>
  );
};

export default NavBar;
