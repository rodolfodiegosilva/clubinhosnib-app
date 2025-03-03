import React from 'react';
import './NavBar.css';
import NavLinks from './NavLinks';

const DesktopNavigation: React.FC = () => {
  return (
    <nav className="desktop-navigation">
      <NavLinks />
    </nav>
  );
};

export default DesktopNavigation;
