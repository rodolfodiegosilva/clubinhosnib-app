import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Collapse,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/slices';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import api from '../../config/axiosConfig';
import { setComments } from 'store/slices/comment/commentsSlice';

// Componente para exibir e gerenciar comentários de professores
const CommentsSection: React.FC = () => {
  // Inicializa o dispatch para ações do Redux
  const dispatch = useDispatch();

  // Seleciona o usuário autenticado e os comentários do estado global
  const { user } = useSelector((state: RootState) => state.auth);
  const rawComments = useSelector((state: RootState) => state.comments.comments);

  // Filtra apenas comentários publicados para exibição
  const comments = useMemo(() => {
    const filtered = rawComments?.filter((c) => c.published) || [];
    return filtered;
  }, [rawComments]);

  // Gerencia o estado do formulário (aberto/fechado)
  const [formOpen, setFormOpen] = useState(false);

  // Controla o estado de envio do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Armazena os dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    clubinho: '',
    neighborhood: '',
  });

  // Gerencia erros de validação no formulário
  const [errors, setErrors] = useState({
    comment: false,
    clubinho: false,
    neighborhood: false,
  });

  // Controla a exibição da notificação de sucesso
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  // Função para buscar comentários da API
  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get('/comments/published');
      dispatch(setComments(response.data));
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  }, [dispatch]);

  // Carrega os comentários ao montar o componente
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Lida com o envio do formulário
  const handleSubmit = async () => {
    // Valida os campos obrigatórios
    const newErrors = {
      comment: !formData.comment.trim(),
      clubinho: !formData.clubinho.trim(),
      neighborhood: !formData.neighborhood.trim(),
    };
    setErrors(newErrors);

    // Impede o envio se houver erros
    if (Object.values(newErrors).some(Boolean)) return;

    setIsSubmitting(true);

    try {
      // Prepara os dados para envio
      const payload = {
        name: formData.name || user?.name || 'Anônimo',
        comment: formData.comment,
        clubinho: formData.clubinho,
        neighborhood: formData.neighborhood,
      };

      // Envia o comentário para a API
      await api.post('/comments', payload);

      // Reseta o formulário e exibe notificação de sucesso
      setFormData({ name: '', comment: '', clubinho: '', neighborhood: '' });
      setErrors({ comment: false, clubinho: false, neighborhood: false });
      setFormOpen(false);
      setSuccessSnackbarOpen(true);

      // Recarrega os comentários
      await fetchComments();
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fecha a notificação de sucesso
  const handleCloseSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  // Configurações do slider para exibição de comentários
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  }), []);

  return (
    // Container principal com estilização
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        mt: 5,
        borderLeft: '5px solid #0288d1',
        backgroundColor: '#e1f5fe',
        borderRadius: 2,
      }}
    >
      {/* Cabeçalho da seção */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CommentIcon sx={{ color: '#0288d1', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="#424242">
          Comentários dos Professores
        </Typography>
      </Box>

      {/* Formulário para adicionar comentários */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ExpandMoreIcon />}
          onClick={() => setFormOpen(!formOpen)}
          sx={{
            mb: 2,
            borderRadius: 20,
            textTransform: 'none',
            color: '#0288d1',
            borderColor: '#0288d1',
          }}
        >
          {formOpen ? 'Fechar formulário' : 'Adicionar Comentário'}
        </Button>
        <Collapse in={formOpen}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Container do formulário */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {/* Campos do formulário */}
              {['name', 'comment', 'clubinho', 'neighborhood'].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  required={field !== 'name'}
                  label={`${field.charAt(0).toUpperCase() + field.slice(1)}${field !== 'name' ? ' (Obrigatório)' : ''}`}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                  multiline={field === 'comment'}
                  rows={field === 'comment' ? 3 : 1}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  error={errors[field as keyof typeof errors]}
                  helperText={
                    errors[field as keyof typeof errors]
                      ? `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`
                      : ''
                  }
                />
              ))}
              {/* Botão de envio */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ borderRadius: 20, textTransform: 'none' }}
                disabled={isSubmitting}
                endIcon={
                  isSubmitting && (
                    <CircularProgress color="inherit" size={18} sx={{ ml: 1 }} />
                  )
                }
              >
                {isSubmitting ? 'Enviando...' : 'Submeter comentário'}
              </Button>
            </Box>
          </motion.div>
        </Collapse>
      </Box>

      {/* Exibição dos comentários */}
      {comments.length > 0 ? (
        <Slider {...sliderSettings}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ p: 2 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Card de comentário */}
                <Card
                  sx={{
                    height: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    {/* Informações do autor */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#0288d1', mr: 2 }}>
                        {comment.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="#424242"
                        >
                          {comment.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Texto do comentário */}
                    <Typography
                      variant="body2"
                      color="#616161"
                      sx={{ mb: 2 }}
                    >
                      {comment.comment}
                    </Typography>
                    {/* Informações adicionais */}
                    <Typography variant="caption" color="text.secondary">
                      {comment.clubinho} • {comment.neighborhood}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Slider>
      ) : (
        // Mensagem exibida quando não há comentários
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Nenhum comentário publicado ainda. Envie o seu e ele aparecerá após
          avaliação.
        </Typography>
      )}

      {/* Notificação de sucesso */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Comentário enviado com sucesso! Ele será avaliado antes de ser
          publicado.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CommentsSection;