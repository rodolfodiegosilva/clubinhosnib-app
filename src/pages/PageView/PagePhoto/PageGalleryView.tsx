import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import FeedItem from "./SectionGallery";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setGalleryData } from "../../../store/slices/gallery/gallerySlice";
import type { GalleryPageData } from "../../../store/slices/gallery/gallerySlice";
import { RootState, AppDispatch } from "../../../store/slices";
import { fetchRoutes } from "../../../store/slices/route/routeSlice";
import { RoleUser } from "store/slices/auth/authSlice";

interface PageGalleryProps {
  idToFetch?: string;
}

export default function PageGalleryView({ idToFetch }: PageGalleryProps) {
  const [galleryDataLocal, setFeedDataLocal] = useState<GalleryPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = isAuthenticated && user?.role === RoleUser.ADMIN;

  const feedMinisterioId = process.env.REACT_APP_FEED_MINISTERIO_ID;

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        const idToFetchPage = idToFetch ?? feedMinisterioId;
        const response = await api.get<GalleryPageData>(`/gallery/${idToFetchPage}`);
        setFeedDataLocal(response.data);
        dispatch(setGalleryData(response.data));
      } catch (err) {
        console.error("Erro ao buscar os dados do feed:", err);
        setError("Erro ao carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [idToFetch, feedMinisterioId, dispatch]);

  const handleDeletePage = async () => {
    try {
      if (!galleryDataLocal?.id) return;

      setIsDeleting(true);
      await api.delete(`/gallery/${galleryDataLocal.id}`);
      await dispatch(fetchRoutes());
      navigate("/");
    } catch (err) {
      console.error("Erro ao excluir a página:", err);
      setError("Erro ao excluir a página. Tente novamente mais tarde.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>Carregando...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
      <Box
        textAlign="center"
        mb={3}
        sx={{ position: "relative" }}
      >
        <Typography variant="h4" fontWeight="bold">
          {galleryDataLocal?.name}
        </Typography>

        <Box display="flex" justifyContent="center" width="100%">
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
              textAlign: "justify",
              maxWidth: "1000px",
              px: { xs: 2, sm: 0 },
            }}
          >
            {galleryDataLocal?.description}
          </Typography>
        </Box>

        {isAdmin && (
          <Box
            mt={2}
            display="flex"
            justifyContent="flex-start"
            gap={2}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              ml: { xs: 2, sm: 0 },
              mb: { xs: 3, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/editar-pagina-fotos")}
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


      <Box mt={4} display="flex" flexDirection="column" gap={4}>
        {galleryDataLocal?.sections.map((section) => (
          <FeedItem
            key={section.id}
            images={section.images}
            caption={section.caption}
            description={section.description}
            createdAt={galleryDataLocal.createdAt}
            updatedAt={galleryDataLocal.updatedAt}
          />
        ))}
      </Box>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !isDeleting && setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta página de galeria? Esta ação não pode ser desfeita.
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
