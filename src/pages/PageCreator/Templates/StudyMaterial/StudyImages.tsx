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
  
  interface ImageItem {
    title: string;
    description: string;
    type: "upload" | "link";
    url: string;
  }
  
  interface Props {
    images: ImageItem[];
    setImages: (imgs: ImageItem[]) => void;
  }
  
  export default function StudyImages({ images, setImages }: Props) {
    const [newImg, setNewImg] = useState<ImageItem>({
      title: "",
      description: "",
      type: "link",
      url: "",
    });
  
    const [errors, setErrors] = useState({
      title: false,
      description: false,
      src: false,
    });
  
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        setNewImg((prev) => ({ ...prev, src: reader.result as string }));
      };
      reader.readAsDataURL(file);
    };
  
    const handleAdd = () => {
      const hasError = !newImg.title || !newImg.description || !newImg.url;
      setErrors({
        title: !newImg.title,
        description: !newImg.description,
        src: !newImg.url,
      });
      if (hasError) return;
  
      setImages([...images, newImg]);
      setNewImg({ title: "", description: "", type: "link", url: "" });
    };
  
    const handleRemove = (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    };
  
    return (
      <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título da Imagem"
              fullWidth
              value={newImg.title}
              onChange={(e) => setNewImg((prev) => ({ ...prev, title: e.target.value }))}
              error={errors.title}
              helperText={errors.title ? "Campo obrigatório" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Descrição da Imagem"
              fullWidth
              value={newImg.description}
              onChange={(e) => setNewImg((prev) => ({ ...prev, description: e.target.value }))}
              error={errors.description}
              helperText={errors.description ? "Campo obrigatório" : ""}
            />
          </Grid>
  
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={newImg.type}
                label="Tipo"
                onChange={(e) => setNewImg((prev) => ({ ...prev, type: e.target.value as "upload" | "link", src: "" }))}
              >
                <MenuItem value="link">Link</MenuItem>
                <MenuItem value="upload">Upload</MenuItem>
              </Select>
            </FormControl>
          </Grid>
  
          {newImg.type === "link" && (
            <Grid item xs={12}>
              <TextField
                label="URL da Imagem"
                fullWidth
                value={newImg.url}
                onChange={(e) => setNewImg((prev) => ({ ...prev, src: e.target.value }))}
                error={errors.src}
                helperText={errors.src ? "Campo obrigatório" : ""}
              />
            </Grid>
          )}
  
          {newImg.type === "upload" && (
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload de Imagem
                <input type="file" hidden accept="image/*" onChange={handleUpload} />
              </Button>
            </Grid>
          )}
  
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleAdd}>
              Adicionar Imagem
            </Button>
          </Grid>
        </Grid>
  
        <Grid container spacing={3} mt={4}>
          {images.map((img, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box border={1} borderRadius={2} p={2} position="relative">
                <Typography fontWeight="bold">{img.title}</Typography>
                <Typography variant="body2" mb={1}>{img.description}</Typography>
                <img
                  src={img.url}
                  alt={img.title}
                  style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
                />
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