import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Alert,
  Paper,
} from "@mui/material";
import api from "../../../config/axiosConfig";
import { RootState, AppDispatch } from "../../../store/slices";
import { setVideoData } from "../../../store/slices/video/videoSlice";
import { fetchRoutes } from "../../../store/slices/route/routeSlice";
import VideoCard from "./VideoCard";

interface VideoPageViewProps {
  idToFetch: string;
}

export default function PageVideoView({ idToFetch }: VideoPageViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const videoData = useSelector((state: RootState) => state.video.videoData);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/video-pages/${idToFetch}`);
        dispatch(setVideoData(response.data));
      } catch (error) {
        console.error("Erro ao buscar dados da página de vídeos", error);
        setError("Erro ao carregar a página de vídeos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idToFetch, dispatch]);

  const handleDeletePage = async () => {
    try {
      if (!videoData?.id) return;
      setIsDeleting(true);
      await api.delete(`/videos-page/${videoData.id}`);
      await dispatch(fetchRoutes());
      navigate("/");
    } catch (err) {
      console.error("Erro ao excluir a página de vídeos:", err);
      setError("Erro ao excluir a página. Tente novamente mais tarde.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" mt={2} color="textSecondary">
            Carregando...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!videoData) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center" variant="h5" color="textSecondary">
          Nenhuma página de vídeos encontrada.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 6,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Box textAlign="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary"
            sx={{ mb: 1, textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
          >
            {videoData.title} {/* Atualizado para title */}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ maxWidth: "600px", mx: "auto" }}>
            {videoData.description}
          </Typography>

          {isAdmin && (
            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate("/adm/editar-pagina-videos", { state: { fromTemplatePage: false } })}
                disabled={isDeleting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Editar Página
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isDeleting}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Excluir Página
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {videoData.videos.map((video) => (
          <Grid item xs={12} key={video.id}>
            <VideoCard video={video} isSmall={isSmall} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !isDeleting && setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta página de vídeos? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeletePage}
            color="error"
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting && <CircularProgress size={20} />}
          >
            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}