import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { AppDispatch } from "../../../store/slices";
import { setVideoData, VideoPageData } from "store/slices/video/videoSlice";
import VideoPageDetailsModal from "./VideoPageDetailsModal";

export default function VideoPageListPage() {

  const [videoPages, setVideoPages] = useState<VideoPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageToDelete, setPageToDelete] = useState<VideoPageData | null>(null);
  const [selectedPage, setSelectedPage] = useState<VideoPageData | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fetchVideoPages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/video-pages");
      setVideoPages(response.data);
    } catch (err) {
      console.error("Erro ao buscar páginas de vídeos:", err);
      setError("Erro ao buscar páginas de vídeos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoPages();
  }, []);

  const truncateDescription = (description: string, length: number = 100) => {
    return description.length > length ? description.substring(0, length) + "..." : description;
  };

  const handleEdit = (page: VideoPageData) => {
    dispatch(setVideoData(page));
    navigate("/adm/editar-pagina-videos");
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;

    setPageToDelete(null);
    setLoading(true);

    try {
      await api.delete(`/video-pages/${pageToDelete.id}`);
      await fetchVideoPages();
    } catch (error) {
      console.error("Erro ao deletar página de vídeos:", error);
      setError("Erro ao deletar página de vídeos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 0, md: 1 },
        py: { xs: 0, md: 1 },
        mt: { xs: 0, md: 4 },
        bgcolor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{ mt: 0, mb: { xs: 6, md: 3 }, fontSize: { xs: "1.5rem", md: "2.4rem" } }}
      >
        Páginas de Vídeos
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : videoPages.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="info">Nenhuma página de vídeos encontrada.</Alert>
        </Box>
      ) : (

        <Grid container spacing={4} justifyContent="center">
          {videoPages.map((page) => (
            <Grid
              item
              key={page.id}
              sx={{
                flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
                maxWidth: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
                minWidth: 280,
                display: "flex",
              }}
            >
              <Card
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  bgcolor: "#fff",
                  border: "1px solid #e0e0e0",
                  position: "relative",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setPageToDelete(page)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "#d32f2f" }}
                  title="Excluir Página"
                >
                  <Delete fontSize="small" />
                </IconButton>

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    textAlign="center"
                    gutterBottom
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: "1rem", md: "1.5rem" } }}
                  >
                    {page.title || "Sem Título"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: ".8rem", md: "1rem" } }}
                  >
                    {truncateDescription(page.description)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: ".8rem", md: "1rem" } }}
                  >
                    {page.public ? "Pública" : "Privada"}
                  </Typography>

                  <Box textAlign="center" mt={3}>
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => setSelectedPage(page)}
                      sx={{ mr: 2 }}
                    >
                      Ver Mais Detalhes
                    </Button>
                    <Button variant="outlined" onClick={() => handleEdit(page)}>
                      Editar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!pageToDelete}
        onClose={() => setPageToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a página <strong>{pageToDelete?.title || "Sem Título"}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPageToDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <VideoPageDetailsModal
        page={selectedPage}
        open={!!selectedPage}
        onClose={() => setSelectedPage(null)}
      />
    </Box>
  );
}