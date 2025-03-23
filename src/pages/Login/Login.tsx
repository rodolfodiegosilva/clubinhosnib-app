import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/auth/authSlice';
import api from '../../../src/config/axiosConfig';
import axios from 'axios';
import { RootState } from '../../store/slices/index'; // 👈 importa seu tipo do estado global

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('joao@email.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('[Login] Tentando login com:', { email });

    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      console.log('[Login] Login realizado com sucesso:', { accessToken, refreshToken, user });
      dispatch(login({ accessToken, refreshToken }));
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[Login] Erro Axios:', error.response?.data || error.message);
        alert('Erro ao fazer login. Verifique suas credenciais.');
      } else {
        console.error('[Login] Erro inesperado:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 16 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Área do Professor
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            type="email"
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Senha"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            size={isMobile ? 'medium' : 'large'}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
