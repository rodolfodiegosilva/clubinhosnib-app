import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
  } from "@mui/material";
  import { ImageData } from "./AddImageModal";
import PhotosItem from "./PhotosItem";
  
  interface PhotosSectionProps {
    images: ImageData[];
    caption: string;
    description: string;
    onCaptionChange: (caption: string) => void;
    onDescriptionChange: (description: string) => void;
    onRemoveImage: (imageIndex: number) => void;
    onOpenModal: () => void;
    onRemoveSection: () => void;
  }
  
  export default function PhotosSection({
    images,
    caption,
    description,
    onCaptionChange,
    onDescriptionChange,
    onRemoveImage,
    onOpenModal,
    onRemoveSection,
  }: PhotosSectionProps) {
    const captionError = caption.trim() === "";
    const descriptionError = description.trim() === "";
  
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", p: 0 }}>
        <Card sx={{ mb: 4, p: 2 }}>
          <Grid container spacing={2}>
            {/* IMAGENS */}
            <Grid item xs={12} md={6}>
              <PhotosItem images={images} onRemoveImage={onRemoveImage} />
            </Grid>
  
            {/* TEXTO E AÇÕES */}
            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: 0 }}>
                <TextField
                  fullWidth
                  label="Título/Legenda da seção"
                  value={caption}
                  onChange={(e) => onCaptionChange(e.target.value)}
                  error={captionError}
                  helperText={captionError ? "A legenda da seção é obrigatória." : ""}
                  margin="normal"
                />
  
                <TextField
                  fullWidth
                  label="Descrição da seção"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  multiline
                  rows={3}
                  error={descriptionError}
                  helperText={descriptionError ? "A descrição da seção é obrigatória." : ""}
                  margin="normal"
                />
  
                <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" color="primary" onClick={onOpenModal}>
                    + Imagem
                  </Button>
                  <Button variant="outlined" color="error" onClick={onRemoveSection}>
                    Excluir Seção
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    );
  }
  