import {
  Box,
  TextField,
  Stack,
  Divider,
  Typography,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DayItem, WeekDay, WeekDayLabel } from "../../../../../store/slices/meditation/meditationSlice";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props {
  days: DayItem[];
  onDaysChange: (value: DayItem[]) => void;
}

const weekDays: WeekDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function MeditationForm({ days, onDaysChange }: Props) {
  const [selectedDay, setSelectedDay] = useState<WeekDay>("Monday");
  const [verse, setVerse] = useState("");
  const [topic, setTopic] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [previewDay, setPreviewDay] = useState<DayItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DayItem | null>(null);

  useEffect(() => {
    if (editId) {
      const item = days.find((d) => d.id === editId);
      if (item) {
        setSelectedDay(item.day as WeekDay);
        setVerse(item.verse);
        setTopic(item.topic);
      }
    }
  }, [editId, days]);

  const handleSaveDay = () => {
    if (!verse || !topic) {
      setError("Preencha todos os campos do dia.");
      return;
    }

    const updated: DayItem = {
      id: editId || Date.now().toString(),
      day: selectedDay,
      verse,
      topic,
    };

    const exists = days.find((d) => d.day === selectedDay);
    if (!editId && exists) {
      setError("Esse dia da semana já foi adicionado.");
      return;
    }

    const updatedDays = editId
      ? days.map((d) => (d.id === editId ? updated : d))
      : [...days, updated];

    onDaysChange(updatedDays);
    setVerse("");
    setTopic("");
    setSelectedDay("Monday");
    setEditId(null);
    setError("");
  };

  const handleEdit = (day: DayItem) => {
    setEditId(day.id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDaysChange(days.filter((d) => d.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  return (
    <Box>
      <Stack spacing={3} mb={3}>
        <FormControl fullWidth>
          <InputLabel id="day-select-label">Dia da Semana</InputLabel>
          <Select
            labelId="day-select-label"
            value={selectedDay}
            label="Dia da Semana"
            onChange={(e: SelectChangeEvent<WeekDay>) =>
              setSelectedDay(e.target.value as WeekDay)
            }
          >
            {weekDays.map((day) => (
              <MenuItem key={day} value={day}>
                {WeekDayLabel[day]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Tema"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <TextField
          fullWidth
          label="Versículo"
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
        />

        <Button variant="contained" onClick={handleSaveDay} sx={{ alignSelf: "flex-start" }}>
          {editId ? "Atualizar Dia" : "Adicionar Dia"}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {days.map((day) => (
          <Grid item xs={12} sm={6} md={4} key={day.id}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography fontWeight="bold" mb={1}>
                  {WeekDayLabel[day.day as WeekDay] || day.day}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {day.topic}
                </Typography>
              </Box>

              <Box display="flex" gap={1} mt={2}>
                <Tooltip title="Visualizar">
                  <IconButton onClick={() => setPreviewDay(day)}>
                    <Eye size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(day)}>
                    <Pencil size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton onClick={() => setDeleteConfirm(day)}>
                    <Trash2 size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!previewDay} onClose={() => setPreviewDay(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          {previewDay ? WeekDayLabel[previewDay.day as WeekDay] || previewDay.day : ""}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Tópico:</strong> {previewDay?.topic}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Versículo:</strong> {previewDay?.verse}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDay(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Deseja remover o dia{" "}
            <strong>
              {deleteConfirm ? WeekDayLabel[deleteConfirm.day as WeekDay] || deleteConfirm.day : ""}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
