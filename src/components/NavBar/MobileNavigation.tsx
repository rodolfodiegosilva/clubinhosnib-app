import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import NavLinks from './NavLinks';
import './NavBar.css';

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <nav className="mobile-navigation">
      <div className="hamburger-icon" onClick={toggleMenu}>
        {open ? <FaTimes size="24px" /> : <FaBars size="24px" />}
      </div>
      {open && (
        <div className="mobile-menu">
          <NavLinks closeMenu={toggleMenu} />
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
