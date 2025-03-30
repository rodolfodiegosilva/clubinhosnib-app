import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { StudyMaterialPageData } from "store/slices/study-material/studyMaterialSlice";
import StudyDocumentViewer from "./StudyDocumentViewer";
import StudyAudioPlayerView from "./StudyAudioPlayerView";
import StudyImageGalleryView from "./StudyImageGalleryView";
import StudyVideoPlayerView from "./StudyVideoPlayerView";
import { fetchRoutes } from "store/slices/route/routeSlice";
import { RootState, AppDispatch } from "store/slices";

interface StudyMaterialsPageViewProps {
  idToFetch: string;
}

export default function StudyMaterialsPageView({ idToFetch }: StudyMaterialsPageViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialPageData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/study-materials-page/${idToFetch}`);
        setStudyMaterials(response.data);
      } catch (err) {
        console.error("Erro ao buscar materiais de estudo:", err);
        setError("Erro ao carregar os materiais de estudo. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idToFetch]);

  const handleDeletePage = async () => {
    try {
      if (!studyMaterials?.id) return;
      setIsDeleting(true);
      await api.delete(`/study-materials-page/${studyMaterials.id}`);
      await dispatch(fetchRoutes());
      navigate("/");
    } catch (err) {
      console.error("Erro ao excluir a página de materiais de estudo:", err);
      setError("Erro ao excluir a página. Tente novamente mais tarde.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const SectionBox = ({
    title,
    color,
    children,
  }: {
    title: string;
    color: string;
    children: React.ReactNode;
  }) => (
    <Paper
      elevation={3}
      sx={{
        mb: 6,
        p: 0.1,
        borderLeft: `6px solid ${color}`,
        backgroundColor: `${color}10`,
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3} px={2} pt={3}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  if (loading) {
    return (
      <Container sx={{ mt: 10 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!studyMaterials) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center">Nenhum material de estudo encontrado.</Typography>
      </Container>
    );
  }

  const { title, subtitle, description, videos, documents, images, audios } = studyMaterials;
  const hasContent = videos?.length || documents?.length || images?.length || audios?.length;

  if (!hasContent) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center">Nenhum material de estudo disponível.</Typography>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        mt: 10,
        mb: 8,
        px: 0,
        width: isMobile ? "100%" : "95%",
        maxWidth: "none !important",
      }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6" mt={1}>
            {subtitle}
          </Typography>
        )}
        <Typography variant="body1" mt={2} color="text.secondary">
          {description}
        </Typography>

        {isAdmin && (
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                navigate("/editar-material-estudo", { state: { fromTemplatePage: false } })
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

      {videos?.length > 0 && (
        <SectionBox title="🎬 Vídeos" color={theme.palette.primary.main}>
          <Grid container spacing={4}>
            {videos.map((video) => (
              <Grid item xs={12} md={6} key={video.id}>
                <StudyVideoPlayerView video={video} />
              </Grid>
            ))}
          </Grid>
        </SectionBox>
      )}

      {documents?.length > 0 && (
        <SectionBox title="📄 Documentos" color={theme.palette.success.main}>
          <Grid container spacing={3}>
            {documents.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <StudyDocumentViewer document={doc} />
              </Grid>
            ))}
          </Grid>
        </SectionBox>
      )}

      {images?.length > 0 && (
        <SectionBox title="🖼️ Imagens" color={theme.palette.warning.main}>
          <Grid container spacing={4}>
            {images.map((img) => (
              <Grid item xs={12} sm={6} md={4} key={img.id}>
                <StudyImageGalleryView image={img} />
              </Grid>
            ))}
          </Grid>
        </SectionBox>
      )}

      {audios?.length > 0 && (
        <SectionBox title="🎧 Áudios" color={theme.palette.secondary.main}>
          <Grid container spacing={4}>
            {audios.map((audio) => (
              <Grid item xs={12} md={6} key={audio.id}>
                <StudyAudioPlayerView audio={audio} />
              </Grid>
            ))}
          </Grid>
        </SectionBox>
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDeletePage} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
