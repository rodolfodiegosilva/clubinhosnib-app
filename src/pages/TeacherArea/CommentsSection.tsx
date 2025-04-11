import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  IconButton,
  Collapse,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/slices';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { addComment, likeComment } from 'store/slices/comment/commentsSlice';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CommentsSection: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const comments = useSelector((state: RootState) => state.comments.comments);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    comentario: '',
    clubinho: '',
    bairro: '',
  });

  const handleSubmit = () => {
    if (!formData.comentario.trim()) return; // Impede envio vazio
    const newComment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nome: formData.nome || user?.name || 'Anônimo',
      comentario: formData.comentario,
      clubinho: formData.clubinho,
      bairro: formData.bairro,
      curtidas: 0,
    };
    dispatch(addComment(newComment));
    setFormData({ nome: '', comentario: '', clubinho: '', bairro: '' });
    setFormOpen(false);
  };

  const handleLike = (id: string) => {
    dispatch(likeComment(id));
  };

  // Configurações do carrossel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Mostra 3 comentários por vez
    slidesToScroll: 1,
    autoplay: true, // Roda automaticamente
    autoplaySpeed: 3000, // Intervalo de 3 segundos
    pauseOnHover: true, // Pausa ao passar o mouse
    responsive: [
      {
        breakpoint: 960, // Telas menores que md
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // Telas menores que sm
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
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
      {/* Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CommentIcon sx={{ color: '#0288d1', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="#424242">
          Mural de Comentários
        </Typography>
      </Box>

      {/* Formulário de Novo Comentário */}
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
          {formOpen ? 'Fechar Formulário' : 'Adicionar Comentário'}
        </Button>
        <Collapse in={formOpen}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <TextField
                fullWidth
                label="Nome (opcional)"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <TextField
                fullWidth
                label="Comentário"
                multiline
                rows={3}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                value={formData.comentario}
                onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
              />
              <TextField
                fullWidth
                label="Clubinho"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                value={formData.clubinho}
                onChange={(e) => setFormData({ ...formData, clubinho: e.target.value })}
              />
              <TextField
                fullWidth
                label="Bairro"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ borderRadius: 20, textTransform: 'none' }}
              >
                Enviar Comentário
              </Button>
            </Box>
          </motion.div>
        </Collapse>
      </Box>

      {/* Carrossel de Comentários */}
      {comments && comments.length > 0 ? (
        <Slider {...sliderSettings}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ p: 2 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#0288d1', mr: 2 }}>
                        {comment.nome.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="#424242">
                          {comment.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="#616161" sx={{ mb: 2 }}>
                      {comment.comentario}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.clubinho} • {comment.bairro}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <IconButton onClick={() => handleLike(comment.id)}>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ThumbUpIcon sx={{ color: comment.curtidas > 0 ? '#0288d1' : '#757575' }} />
                        </motion.div>
                      </IconButton>
                      <Typography variant="caption" color="text.secondary">
                        {comment.curtidas} curtida{comment.curtidas !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Nenhum comentário disponível. Seja o primeiro a compartilhar!
        </Typography>
      )}
    </Paper>
  );
};

export default CommentsSection;