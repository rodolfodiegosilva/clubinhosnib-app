import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { Visibility, PictureAsPdf, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { AppDispatch } from "../../../store/slices";
import {
  setMeditationData,
  MeditationData,
  DayItem as ReduxDayItem,
  MediaItem as ReduxMediaItem,
  WeekDay,
  WeekDayLabel,
} from "../../../store/slices/meditation/meditationSlice";

interface DayItem {
  id: string;
  day: string;
  verse: string;
  topic: string;
}

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "link" | "upload";
  platform?: string;
  description?: string;
}

interface MeditationItem {
  id: string;
  topic: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  days: DayItem[];
  media: MediaItem;
}

export default function MeditationListPage() {
  const [meditations, setMeditations] = useState<MeditationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayItem | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [meditationToDelete, setMeditationToDelete] = useState<MeditationItem | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeditations();
  }, []);

  const fetchMeditations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/meditations");
      const meditationList = response.data.map((item: any) => item.meditation);
      setMeditations(meditationList);
    } catch (err) {
      console.error("Erro ao buscar meditações:", err);
      setError("Erro ao buscar meditações");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getMediaPreviewUrl = (media: MediaItem): string => {
    if (media.type === "upload") return media.url;
    if (media.type === "link" && media.platform === "googledrive") {
      const match = media.url.match(/\/d\/([^/]+)\//);
      if (match?.[1]) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return media.url;
  };

  const handleOpenEdit = (meditation: MeditationItem) => {
    const reduxMedia: ReduxMediaItem = {
      id: meditation.media?.id || "",
      title: meditation.media?.title || "",
      description: meditation.media?.description || "",
      type: meditation.media?.type,
      isLocalFile: meditation.media?.type === "upload",
      url: meditation.media?.url || "",
      platform: meditation.media?.platform as any,
    };

    const reduxMeditation: MeditationData = {
      id: meditation.id,
      topic: meditation.topic,
      startDate: meditation.startDate,
      endDate: meditation.endDate,
      createdAt: meditation.createdAt,
      updatedAt: meditation.updatedAt,
      media: reduxMedia,
      days: meditation.days.map<ReduxDayItem>((day) => ({
        id: day.id,
        day: day.day as WeekDay,
        verse: day.verse,
        topic: day.topic,
      })),
    };

    dispatch(setMeditationData(reduxMeditation));
    navigate("/editar-meditacao");
  };

  const handleDelete = async () => {
    if (!meditationToDelete) return;

    setMeditationToDelete(null);
    setLoading(true);

    try {
      await api.delete(`/meditations/${meditationToDelete.id}`);
      await fetchMeditations();
    } catch (error) {
      console.error("Erro ao deletar meditação:", error);
      setError("Erro ao deletar meditação");
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
        sx={{ mt: { xs: 0, md: 0 }, mb: { xs: 6, md: 3 }, fontSize: { xs: "1.5rem", md: "2.4rem" } }}
      >
        Meditações Semanais
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {meditations.map((meditation) => (
            <Grid
              item
              key={meditation.id}
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
                  onClick={() => setMeditationToDelete(meditation)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "#d32f2f" }}
                  title="Excluir Meditação"
                >
                  <Delete fontSize="small" />
                </IconButton>

                <CardContent>
                  <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: "1rem", md: "1.5rem" } }}>
                    {meditation.topic}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: ".8rem", md: "1rem" } }}>
                    {formatDate(meditation.startDate)} - {formatDate(meditation.endDate)}
                  </Typography>

                  <Typography fontWeight="bold" mb={1}>
                    Dias:
                  </Typography>
                  <Stack spacing={1}>
                    {meditation.days.map((day) => (
                      <Paper
                        key={day.id}
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.2,
                          px: 2,
                          border: "1px solid #dcdcdc",
                          borderRadius: 2,
                          bgcolor: "#fafafa",
                        }}
                      >
                        <Typography fontWeight="medium">
                          {WeekDayLabel[day.day as keyof typeof WeekDayLabel]}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedDay(day)}
                          sx={{ color: "#616161" }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>

                  {meditation.media?.url && (
                    <Box textAlign="center" mt={2}>
                      <Button
                        startIcon={<PictureAsPdf />}
                        variant="text"
                        size="small"
                        onClick={() => setMediaUrl(getMediaPreviewUrl(meditation.media))}
                      >
                        Ver Material
                      </Button>
                    </Box>
                  )}

                  <Box textAlign="center" mt={3}>
                    <Button variant="outlined" onClick={() => handleOpenEdit(meditation)} fullWidth>
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
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle textAlign="center" fontWeight="bold">
          {selectedDay ? WeekDayLabel[selectedDay.day as keyof typeof WeekDayLabel] : ""}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Tema do Dia
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {selectedDay?.topic}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Versículo
              </Typography>
              <Typography variant="body1" fontStyle="italic">
                {selectedDay?.verse}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button variant="outlined" onClick={() => setSelectedDay(null)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!mediaUrl} onClose={() => setMediaUrl(null)} fullWidth maxWidth="xl">
        <DialogTitle>Meditação da Semana</DialogTitle>
        <DialogContent>
          <Box sx={{ width: "70vw", height: "70vh", mx: "auto" }}>
            <iframe
              src={mediaUrl || ""}
              width="100%"
              height="100%"
              allow="autoplay"
              title="Documento"
              style={{ border: "none" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMediaUrl(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!meditationToDelete}
        onClose={() => setMeditationToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a meditação <strong>{meditationToDelete?.topic}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMeditationToDelete(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
