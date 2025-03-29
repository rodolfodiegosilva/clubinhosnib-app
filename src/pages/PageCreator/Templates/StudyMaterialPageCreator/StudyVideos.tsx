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
  } from "@mui/material";
  import { Delete } from "@mui/icons-material";
  import { useState } from "react";
  
  interface VideoItem {
    title: string;
    description: string;
    type: "upload" | "link";
    platform?: "youtube" | "google-drive" | "onedrive";
    url: string;
  }
  
  interface Props {
    videos: VideoItem[];
    setVideos: (videos: VideoItem[]) => void;
  }
  
  export default function StudyVideos({ videos, setVideos }: Props) {
    const [newVideo, setNewVideo] = useState<VideoItem>({
      title: "",
      description: "",
      type: "link",
      platform: "youtube",
      url: "",
    });
  
    const [errors, setErrors] = useState({
      title: false,
      description: false,
      url: false,
    });
  
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setNewVideo((prev) => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    };
  
    const handleAdd = () => {
      const hasError = !newVideo.title || !newVideo.description || !newVideo.url;
      setErrors({
        title: !newVideo.title,
        description: !newVideo.description,
        url: !newVideo.url,
      });
      if (hasError) return;
      setVideos([...videos, newVideo]);
      setNewVideo({ title: "", description: "", type: "link", platform: "youtube", url: "" });
    };
  
    const handleRemove = (index: number) => {
      setVideos(videos.filter((_, i) => i !== index));
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
                label="URL do Vídeo"
                fullWidth
                value={newVideo.url}
                onChange={(e) => setNewVideo((prev) => ({ ...prev, url: e.target.value }))}
                error={errors.url}
                helperText={errors.url ? "Campo obrigatório" : ""}
              />
            </Grid>
          )}
  
          {newVideo.type === "upload" && (
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload de Vídeo
                <input type="file" hidden accept="video/*" onChange={handleUpload} />
              </Button>
            </Grid>
          )}
  
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleAdd}>
              Adicionar Vídeo
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
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemove(index)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }