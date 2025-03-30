import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [errors, setErrors] = useState({ nome: false, email: false, telefone: false, mensagem: false });
  const [submitted, setSubmitted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validate = () => {
    const newErrors = {
      nome: form.nome.trim() === '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      telefone: form.telefone.trim().length < 10,
      mensagem: form.mensagem.trim() === '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm({ nome: '', email: '', telefone: '', mensagem: '' });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      px={2}
      mt={{ xs: 9, md: 5 }}
      sx={{
        background: "linear-gradient(135deg, white 0%, #007bff 100%)",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 4 },
          mt: { xs: 4, md: 6 },
          mb: { xs: 4, md: 8 },
          width: '100%',
          maxWidth: 700,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Fale Conosco
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Entre em contato para saber mais informações.
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Mensagem enviada com sucesso!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.nome}
            helperText={errors.nome && "Nome é obrigatório."}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.email}
            helperText={errors.email && "Email inválido."}
          />

          <TextField
            label="Telefone"
            name="telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.telefone}
            helperText={errors.telefone && "Telefone inválido (mínimo 10 dígitos)."}
          />

          <TextField
            label="Mensagem"
            name="mensagem"
            value={form.mensagem}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
            error={errors.mensagem}
            helperText={errors.mensagem && "Mensagem é obrigatória."}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            sx={{ mt: 2 }}
          >
            Enviar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Contact;