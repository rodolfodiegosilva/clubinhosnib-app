import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Grid from '@mui/material/Grid';

import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";

interface VideoItem {
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "youtube" | "google-drive" | "onedrive";
  src: string;
}

export default function Videos() {
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newVideo, setNewVideo] = useState<VideoItem>({
    title: "",
    description: "",
    type: "link",
    platform: "youtube",
    src: "",
  });
  const [errors, setErrors] = useState({
    pageTitle: false,
    pageDescription: false,
    newVideoTitle: false,
    newVideoDescription: false,
    newVideoSrc: false,
  });

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewVideo((prev) => ({ ...prev, src: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideo = () => {
    const hasError = !newVideo.title || !newVideo.description || !newVideo.src;
    setErrors((prev) => ({
      ...prev,
      newVideoTitle: !newVideo.title,
      newVideoDescription: !newVideo.description,
      newVideoSrc: !newVideo.src,
    }));
    if (hasError) return;

    setVideos([...videos, newVideo]);
    setNewVideo({ title: "", description: "", type: "link", platform: "youtube", src: "" });
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSavePage = async () => {
    const pageHasError = !pageTitle || !pageDescription || videos.length === 0;
    const hasInvalidVideos = videos.some(video => !video.title || !video.description);

    setErrors((prev) => ({
      ...prev,
      pageTitle: !pageTitle,
      pageDescription: !pageDescription,
    }));

    if (pageHasError || hasInvalidVideos) return;

    const payload = {
      pageTitle,
      pageDescription,
      videos,
    };

    try {
      const response = await fetch("/videos-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao salvar página");
    } catch (err) {
      console.error("Erro ao salvar página", err);
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        width: { xs: "95%", md: "100%" },
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        sx={{
          width: "100%",
          fontSize: {
            xs: "1.6rem",
            sm: "2rem",
            md: "2.25rem"
          },
          textAlign: "center",
        }}
      >
        Criar Página de Vídeos
      </Typography>

      <Grid container spacing={2} sx={{ width: { xs: "95%", md: "100%" }, mx: "auto", mb: 5 }}>
        <Grid item xs={12}>
          <TextField
            label="Título da Página"
            fullWidth
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            error={errors.pageTitle}
            helperText={errors.pageTitle ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descrição da Página"
            fullWidth
            multiline
            rows={3}
            value={pageDescription}
            onChange={(e) => setPageDescription(e.target.value)}
            error={errors.pageDescription}
            helperText={errors.pageDescription ? "Campo obrigatório" : ""}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" mb={2} fontWeight="medium">
        Adicionar Novo Vídeo
      </Typography>

      <Grid container spacing={2} sx={{ width: { xs: "95%", md: "100%" }, mx: "auto", mb: 4 }}>
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
                  src: "",
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
                <MenuItem value="google-drive">Google Drive</MenuItem>
                <MenuItem value="onedrive">OneDrive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {newVideo.type === "link" && (
          <Grid item xs={12}>
            <TextField
              label="URL do Vídeo (embed)"
              fullWidth
              value={newVideo.src}
              onChange={(e) => setNewVideo((prev) => ({ ...prev, src: e.target.value }))}
              error={errors.newVideoSrc}
              helperText={errors.newVideoSrc ? "Campo obrigatório" : ""}
            />
          </Grid>
        )}

        {newVideo.type === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Vídeo
              <input type="file" hidden accept="video/*" onChange={handleUploadFile} />
            </Button>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleAddVideo}>
            Adicionar Vídeo
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center">
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">{video.title}</Typography>
              <Typography variant="body2" mb={2}>{video.description}</Typography>
              {video.type === "link" ? (
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    mb: 2,
                    iframe: { width: "100%", height: "100%", border: 0 },
                  }}
                >
                  <iframe src={video.src} title={`Vídeo ${index + 1}`} allowFullScreen />
                </Box>
              ) : (
                <video controls style={{ width: "100%", marginBottom: "16px" }}>
                  <source src={video.src} />
                  Seu navegador não suporta vídeo.
                </video>
              )}
              <Box mt={1} display="flex" justifyContent="flex-end">
                <IconButton onClick={() => handleRemoveVideo(index)} size="small" color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={6}>
        <Button variant="contained" size="large" onClick={handleSavePage}>
          Salvar Página
        </Button>
      </Box>
    </Box>
  );
}