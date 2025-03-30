// Refatorado com edição, validações, preview, confirmação de remoção e suporte a todas plataformas
import {
  Box,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";
import { validateMediaURL } from "utils/validateMediaURL";

interface Props {
  videos: StudyMediaItem[];
  setVideos: (videos: StudyMediaItem[]) => void;
}

export default function StudyVideos({ videos, setVideos }: Props) {
  const [newVideo, setNewVideo] = useState<StudyMediaItem>({
    title: "",
    description: "",
    type: "link",
    platform: "youtube",
    url: "",
  });
  const [fileName, setFileName] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    url: false,
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setNewVideo((prev) => ({ ...prev, url, file }));
  };

  const handleAddOrUpdate = () => {
    const isValid = newVideo.type === "upload" || validateMediaURL(newVideo.url, newVideo.platform);
    const hasError =
      !newVideo.title || !newVideo.description || !newVideo.url || (newVideo.type === "link" && !isValid);

    setErrors({
      title: !newVideo.title,
      description: !newVideo.description,
      url: !newVideo.url || (newVideo.type === "link" && !isValid),
    });

    if (hasError) return;

    const updatedList = [...videos];
    if (editingIndex !== null) {
      updatedList[editingIndex] = newVideo;
      setEditingIndex(null);
    } else {
      updatedList.push(newVideo);
    }

    setVideos(updatedList);
    setNewVideo({ title: "", description: "", type: "link", platform: "youtube", url: "" });
    setFileName("");
  };

  const handleEdit = (index: number) => {
    setNewVideo(videos[index]);
    setFileName(videos[index].file?.name || "");
    setEditingIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setVideos(videos.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título do Vídeo"
            fullWidth
            value={newVideo.title}
            onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            helperText={errors.title ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição do Vídeo"
            fullWidth
            value={newVideo.description}
            onChange={(e) => setNewVideo((prev) => ({ ...prev, description: e.target.value }))}
            error={errors.description}
            helperText={errors.description ? "Campo obrigatório" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newVideo.type}
              label="Tipo"
              onChange={(e) =>
                setNewVideo((prev) => ({
                  ...prev,
                  type: e.target.value as "upload" | "link",
                  platform: e.target.value === "link" ? "youtube" : undefined,
                  url: "",
                  file: undefined,
                }))
              }
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {newVideo.type === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={newVideo.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setNewVideo((prev) => ({
                      ...prev,
                      platform: e.target.value as StudyMediaItem["platform"],
                    }))
                  }
                >
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="google-drive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="URL do Vídeo"
                fullWidth
                value={newVideo.url}
                onChange={(e) => setNewVideo((prev) => ({ ...prev, url: e.target.value }))}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {newVideo.type === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Vídeo
              <input type="file" hidden accept="video/*" onChange={handleUpload} />
            </Button>
            {fileName && (
              <Typography variant="body2" mt={1}>
                Arquivo selecionado: <strong>{fileName}</strong>
              </Typography>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleAddOrUpdate}>
            {editingIndex !== null ? "Salvar Alterações" : "Adicionar Vídeo"}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={4}>
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box border={1} borderRadius={2} p={2} position="relative">
              <Typography fontWeight="bold">{video.title}</Typography>
              <Typography variant="body2" mb={1}>{video.description}</Typography>
              {video.type === "link" ? (
                <Box sx={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={video.url}
                    title={video.title}
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 0 }}
                  />
                </Box>
              ) : (
                <video controls style={{ width: '100%', marginTop: 8 }}>
                  <source src={video.url} />
                </video>
              )}
              <Box position="absolute" top={8} right={8} display="flex" gap={1}>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton size="small" color="error" onClick={() => setDeleteIndex(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente remover este vídeo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmRemove}>Remover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
