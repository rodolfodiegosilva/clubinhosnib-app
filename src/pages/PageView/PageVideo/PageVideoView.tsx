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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/videos-page/${idToFetch}`);
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
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", mt: 10, p: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>Carregando...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", mt: 10, p: 0 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!videoData) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", mt: 10, p: 0 }}>
        <Typography align="center">Nenhuma página de vídeos encontrada.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", mt: 10, p: 0 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {videoData.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {videoData.description}
        </Typography>

        {isAuthenticated && (
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                navigate("/editar-pagina-videos", {
                  state: { fromTemplatePage: false },
                })
              }
              disabled={isDeleting}
            >
              Editar Página
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={isDeleting}
            >
              Excluir Página
            </Button>
          </Box>
        )}
      </Box>

      <Grid
        container
        spacing={6}
        direction="column"
        sx={{ flexWrap: "nowrap", overflowX: "auto", mt: 4 }}
      >
        {videoData.videos.map((video) => (
          <Grid item key={video.id}>
            <VideoCard video={video} isSmall={isSmall} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !isDeleting && setDeleteConfirmOpen(false)}
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
