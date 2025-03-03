import React from 'react';
import { FaFacebook as FacebookIcon, FaInstagram as InstagramIcon, FaYoutube as YoutubeIcon } from 'react-icons/fa6';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <a href="/">Início</a>
        <a href="/sobre">Sobre</a>
        <a href="/eventos">Eventos</a>
        <a href="/contato">Contato</a>
      </div>

      <div className={styles.footerSocials}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FacebookIcon  />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <InstagramIcon  />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <YoutubeIcon  />
        </a>
      </div>

      <p className={styles.footerText}>
        © 2025 Clubinhos NIB. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
