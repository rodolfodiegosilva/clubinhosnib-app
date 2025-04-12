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
import { setWeekMaterialData, WeekMaterialPageData } from "store/slices/week-material/weekMaterialSlice";
import WeekMaterialDetailsModal from "./WeekMaterialDetailsModal";

export default function WeekMaterialListPage() {
  const [weekMaterials, setWeekMaterials] = useState<WeekMaterialPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [materialToDelete, setMaterialToDelete] = useState<WeekMaterialPageData | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<WeekMaterialPageData | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const fetchWeekMaterials = async () => {
    setLoading(true);
    try {
      const response = await api.get("/week-material-pages");
      setWeekMaterials(response.data);
    } catch (err) {
      console.error("Erro ao buscar materiais semanais:", err);
      setError("Erro ao buscar materiais semanais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekMaterials();
  }, []);

  const truncateDescription = (description: string, length: number = 100) => {
    return description.length > length ? description.substring(0, length) + "..." : description;
  };

  const handleEdit = (material: WeekMaterialPageData) => {
    dispatch(setWeekMaterialData(material));
    navigate("/adm/editar-pagina-semana");
  };

  const handleDelete = async () => {
    if (!materialToDelete) return;

    setMaterialToDelete(null);
    setLoading(true);

    try {
      await api.delete(`/week-material-pages/${materialToDelete.id}`);
      await fetchWeekMaterials();
    } catch (error) {
      console.error("Erro ao deletar material:", error);
      setError("Erro ao deletar material");
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
        Materiais Semanais
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : weekMaterials.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="info">Nenhum material encontrado.</Alert>
        </Box>
      ) : (
        /* Grid de cards */
        <Grid container spacing={4} justifyContent="center">
          {weekMaterials.map((material) => (
            <Grid
              item
              key={material.id}
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
                  onClick={() => setMaterialToDelete(material)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "#d32f2f" }}
                  title="Excluir Material"
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
                    {material.title}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { medica: ".8rem", md: "1rem" } }}
                  >
                    {material.subtitle}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: ".8rem", md: "1rem" } }}
                  >
                    {truncateDescription(material.description)}
                  </Typography>

                  <Box textAlign="center" mt={3}>
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => setSelectedMaterial(material)}
                      sx={{ mr: 2 }}
                    >
                      Ver Mais Detalhes
                    </Button>
                    <Button variant="outlined" onClick={() => handleEdit(material)}>
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
        open={!!materialToDelete}
        onClose={() => setMaterialToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o material <strong>{materialToDelete?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaterialToDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <WeekMaterialDetailsModal
        material={selectedMaterial}
        open={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
    </Box>
  );
}