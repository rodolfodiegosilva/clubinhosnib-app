import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { VideoItem } from "../../../../../store/slices/video/videoSlice";
import { Dispatch, SetStateAction } from "react";

interface VideoFormProps {
  newVideo: VideoItem;
  errors: {
    pageTitle: boolean;
    pageDescription: boolean;
    newVideoTitle: boolean;
    newVideoDescription: boolean;
    newVideoSrc: boolean;
    newVideoURL: boolean;
  };
  setNewVideo: Dispatch<SetStateAction<VideoItem>>;
  handleUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddVideo: () => void;
  isEditing: boolean;
  uploadProgress: Record<string, boolean>;
}

export default function VideoForm({
  newVideo,
  errors,
  setNewVideo,
  handleUploadFile,
  handleAddVideo,
  isEditing,
  uploadProgress,
}: VideoFormProps) {
  return (
    <>
      <Typography variant="h6" mb={2} fontWeight="medium">
        {isEditing ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título do Vídeo"
            fullWidth
            value={newVideo.title}
            onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
            error={errors.newVideoTitle}
            helperText={errors.newVideoTitle ? "Campo obrigatório" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição do Vídeo"
            fullWidth
            value={newVideo.description}
            onChange={(e) => setNewVideo((prev) => ({ ...prev, description: e.target.value }))}
            error={errors.newVideoDescription}
            helperText={errors.newVideoDescription ? "Campo obrigatório" : ""}
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
                  isLocalFile: e.target.value === "upload",
                }))
              }
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {newVideo.type === "link" && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Plataforma</InputLabel>
              <Select
                value={newVideo.platform || ""}
                label="Plataforma"
                onChange={(e) =>
                  setNewVideo((prev) => ({
                    ...prev,
                    platform: e.target.value as VideoItem["platform"],
                  }))
                }
              >
                <MenuItem value="youtube">YouTube</MenuItem>
                <MenuItem value="googledrive">Google Drive</MenuItem>
                <MenuItem value="onedrive">OneDrive</MenuItem>
                <MenuItem value="ANY">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {newVideo.type === "link" && (
          <Grid item xs={12}>
            <TextField
              label="URL do Vídeo (embed)"
              fullWidth
              value={newVideo.url || ""}
              onChange={(e) => setNewVideo((prev) => ({ ...prev, url: e.target.value }))}
              error={errors.newVideoSrc || errors.newVideoURL}
              helperText={
                errors.newVideoSrc
                  ? "Campo obrigatório"
                  : errors.newVideoURL
                  ? "URL inválida para a plataforma selecionada"
                  : ""
              }
            />
          </Grid>
        )}

        {newVideo.type === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Escolher Vídeo
              <input type="file" hidden accept="video/*" onChange={handleUploadFile} />
            </Button>
            {newVideo.file && (
              <Typography variant="body2" display="inline">
                {newVideo.file.name}{" "}
                {uploadProgress[newVideo.file.name] === false ? (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                ) : (
                  "✔"
                )}
              </Typography>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddVideo}
            disabled={
              newVideo.type === "upload" &&
              newVideo.file &&
              uploadProgress[newVideo.file.name] === false
            }
          >
            {isEditing ? "Atualizar Vídeo" : "Adicionar Vídeo"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}