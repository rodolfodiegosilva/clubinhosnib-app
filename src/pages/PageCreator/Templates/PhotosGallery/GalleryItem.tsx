import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  Grid,
  Container,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ImageData } from "./AddImageModal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GalleryItemProps {
  images: ImageData[];
  caption: string;
  description: string;
  onCaptionChange: (caption: string) => void;
  onDescriptionChange: (description: string) => void;
  onRemoveImage: (imageIndex: number) => void;
  onOpenModal: () => void;
  onRemoveSection: () => void;
}

export function GalleryItem({
  images,
  caption,
  description,
  onCaptionChange,
  onDescriptionChange,
  onRemoveImage,
  onOpenModal,
  onRemoveSection,
}: GalleryItemProps) {
  const captionError = caption.trim() === "";
  const descriptionError = description.trim() === "";
  const noImages = images.length === 0;

  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", p: 0 }}>
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2}>
          {/* IMAGENS */}
          <Grid item xs={12} md={6}>
            {noImages ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Nenhuma imagem adicionada nesta seção.
              </Alert>
            ) : (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                style={{ borderRadius: 8, overflow: "hidden" }}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={img.url}
                        alt={`Imagem ${index + 1}`}
                        style={{ width: "100%", height: 300, objectFit: "cover" }}
                      />
                      <IconButton
                        onClick={() => onRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <CloseIcon color="error" />
                      </IconButton>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
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
