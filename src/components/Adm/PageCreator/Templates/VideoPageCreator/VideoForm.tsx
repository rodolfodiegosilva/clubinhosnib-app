import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
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
}

export default function VideoForm({
  newVideo,
  errors,
  setNewVideo,
  handleUploadFile,
  handleAddVideo,
}: VideoFormProps) {
  return (
    <>
      <Typography variant="h6" mb={2} fontWeight="medium">
        Adicionar Novo Vídeo
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Título do Vídeo */}
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

        {/* Descrição do Vídeo */}
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

        {/* Tipo de Vídeo */}
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

        {/* Plataforma (somente para links) */}
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

        {/* URL do Vídeo (somente para links) */}
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

        {/* Upload de Vídeo (somente para upload) */}
        {newVideo.type === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Vídeo
              <input type="file" hidden accept="video/*" onChange={handleUploadFile} />
            </Button>
          </Grid>
        )}

        {/* Botão de Adicionar */}
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleAddVideo}>
            Adicionar Vídeo
          </Button>
        </Grid>
      </Grid>
    </>
  );
}