import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Visibility, Delete, Edit, Publish } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/axiosConfig';
import { AppDispatch } from '../../../store/slices';
import CommentDetailsModal from './CommentDetailsModal';

// Interface para os dados de um comentário
interface CommentData {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  comment: string;
  clubinho: string;
  neighborhood: string;
  published: boolean;
}

// Componente principal para gerenciamento de comentários
export default function CommentsListPage() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<CommentData | null>(null);
  const [commentToPublish, setCommentToPublish] = useState<CommentData | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<CommentData | null>(null);
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    comment: '',
    clubinho: '',
    neighborhood: '',
  });
  const [editErrors, setEditErrors] = useState({
    comment: false,
    clubinho: false,
    neighborhood: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Busca os comentários da API
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/comments');
      setComments(response.data);
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
      setError('Erro ao buscar comentários');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os comentários ao montar o componente
  useEffect(() => {
    fetchComments();
  }, []);

  // Trunca a descrição para exibição na lista
  const truncateDescription = (description: string, length: number = 100) => {
    return description.length > length ? description.substring(0, length) + '...' : description;
  };

  // Lida com a publicação de um comentário
  const handlePublish = async () => {
    if (!commentToPublish) return;

    setLoading(true);
    try {
      await api.put(`/comments/${commentToPublish.id}`, {
        name: commentToPublish.name,
        comment: commentToPublish.comment,
        clubinho: commentToPublish.clubinho,
        neighborhood: commentToPublish.neighborhood,
        published: true, // Enviado como booleano
      });
      setCommentToPublish(null);
      await fetchComments();
    } catch (error) {
      console.error('Erro ao publicar comentário:', error);
      setError('Erro ao publicar comentário');
    } finally {
      setLoading(false);
    }
  };

  // Lida com a exclusão de um comentário
  const handleDelete = async () => {
    if (!commentToDelete) return;

    setLoading(true);
    try {
      await api.delete(`/comments/${commentToDelete.id}`);
      setCommentToDelete(null);
      await fetchComments();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      setError('Erro ao deletar comentário');
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal de edição com os dados do comentário
  const handleEditOpen = (comment: CommentData) => {
    setCommentToEdit(comment);
    setEditFormData({
      name: comment.name,
      comment: comment.comment,
      clubinho: comment.clubinho,
      neighborhood: comment.neighborhood,
    });
    setEditErrors({ comment: false, clubinho: false, neighborhood: false });
  };

  // Lida com o salvamento e publicação do comentário editado
  const handleEditSave = async () => {
    if (!commentToEdit) return;

    const newErrors = {
      comment: !editFormData.comment.trim(),
      clubinho: !editFormData.clubinho.trim(),
      neighborhood: !editFormData.neighborhood.trim(),
    };
    setEditErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await api.put(`/comments/${commentToEdit.id}`, {
        name: editFormData.name,
        comment: editFormData.comment,
        clubinho: editFormData.clubinho,
        neighborhood: editFormData.neighborhood,
        published: true, // Enviado como booleano
      });
      setCommentToEdit(null);
      await fetchComments();
    } catch (error) {
      console.error('Erro ao salvar comentário:', error);
      setError('Erro ao salvar comentário');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container principal com estilização administrativa
    <Box
      sx={{
        px: { xs: 0, md: 1 },
        py: { xs: 0, md: 1 },
        mt: { xs: 0, md: 4 },
        bgcolor: '#f5f7fa',
        minHeight: '100vh',
      }}
    >
      {/* Título da página */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{ mt: 0, mb: { xs: 6, md: 3 }, fontSize: { xs: '1.5rem', md: '2.4rem' } }}
      >
        Gerenciamento de Comentários
      </Typography>

      {loading ? (
        // Exibe indicador de carregamento
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        // Exibe mensagem de erro
        <Box textAlign="center" mt={10}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : comments.length === 0 ? (
        // Exibe mensagem quando não há comentários
        <Box textAlign="center" mt={10}>
          <Alert severity="info">Nenhum comentário encontrado.</Alert>
        </Box>
      ) : (
        // Lista os comentários em um grid
        <Grid container spacing={4} justifyContent="center">
          {comments.map((comment) => (
            <Grid
              item
              key={comment.id}
              sx={{
                flexBasis: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                maxWidth: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                minWidth: 280,
                display: 'flex',
              }}
            >
              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  bgcolor: '#fff',
                  border: '1px solid #e0e0e0',
                  position: 'relative',
                }}
              >
                {/* Botão de exclusão */}
                <IconButton
                  size="small"
                  onClick={() => setCommentToDelete(comment)}
                  sx={{ position: 'absolute', top: 8, right: 8, color: '#d32f2f' }}
                  title="Excluir Comentário"
                >
                  <Delete fontSize="small" />
                </IconButton>

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    textAlign="center"
                    gutterBottom
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.5rem' } }}
                  >
                    {comment.name || 'Sem Nome'}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: '.8rem', md: '1rem' } }}
                  >
                    {truncateDescription(comment.comment)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: '.8rem', md: '1rem' } }}
                  >
                    {comment.published ? 'Publicado' : 'Não Publicado'}
                  </Typography>

                  <Box textAlign="center" mt={3}>
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => setSelectedComment(comment)}
                      sx={{ mr: 2 }}
                    >
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEditOpen(comment)}
                      sx={{ mr: 2 }}
                    >
                      Editar
                    </Button>
                    {!comment.published && (
                      <Button
                        variant="contained"
                        startIcon={<Publish />}
                        onClick={() => setCommentToPublish(comment)}
                        color="success"
                      >
                        Publicar
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o comentário de{' '}
            <strong>{commentToDelete?.name || 'Sem Nome'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentToDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmação de publicação */}
      <Dialog
        open={!!commentToPublish}
        onClose={() => setCommentToPublish(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Publicação</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja publicar o comentário de{' '}
            <strong>{commentToPublish?.name || 'Sem Nome'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentToPublish(null)}>Cancelar</Button>
          <Button color="success" variant="contained" onClick={handlePublish}>
            Publicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edição */}
      <Dialog
        open={!!commentToEdit}
        onClose={() => setCommentToEdit(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Comentário</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
                value={editFormData[field as keyof typeof editFormData]}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, [field]: e.target.value })
                }
                error={editErrors[field as keyof typeof editErrors]}
                helperText={
                  editErrors[field as keyof typeof editErrors]
                    ? `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`
                    : ''
                }
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentToEdit(null)}>Cancelar</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditSave}
            disabled={loading}
          >
            Salvar e Publicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalhes */}
      <CommentDetailsModal
        comment={selectedComment}
        open={!!selectedComment}
        onClose={() => setSelectedComment(null)}
      />
    </Box>
  );
}