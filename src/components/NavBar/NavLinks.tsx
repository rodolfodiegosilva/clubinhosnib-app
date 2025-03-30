import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/slices/index';
import { logout } from '../../store/slices/auth/authSlice';
import api from '../../config/axiosConfig';
import { Button } from '@mui/material';

const NavLinks: React.FC<{ closeMenu?: () => void }> = ({ closeMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleClick = () => {
    if (closeMenu) closeMenu();
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('[Logout] Erro na requisição /auth/logout:', error);
    } finally {
      dispatch(logout());
      navigate('/');
      if (closeMenu) closeMenu();
    }
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

      {isAdmin && (  // 👈 Exibir somente se logado E admin
        <li className={location.pathname === '/criar-pagina' ? 'active' : ''}>
          <Link to="/criar-pagina" onClick={handleClick}>Criar página</Link>
        </li>
      )}

      {isAuthenticated && (
        <>
          <li className={location.pathname === '/area-do-professor' ? 'active' : ''}>
            <Link to="/area-do-professor" onClick={handleClick}>Area do Professor</Link>
          </li>
          <li>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              size="small"
              sx={{ fontWeight: 'bold', color: '#fff' }}
            >
              Sair
            </Button>
          </li>
        </>



      )}

      {!isAuthenticated && (
        <li className={location.pathname === '/login' ? 'active' : ''}>
          <Link to="/login" onClick={handleClick}>Area do Professor</Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
