import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ImageData } from "./AddImageModal";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GalleryItemProps {
  images: ImageData[];
  caption: string;
  description: string;
  onCaptionChange: (newCaption: string) => void;
  onDescriptionChange: (newDescription: string) => void;
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
  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", p: 0 }}>
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                style={{ borderRadius: 8, overflow: "hidden" }}
              >
                {images.map((imgData, i) => (
                  <SwiperSlide key={i}>
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={imgData.url}
                        alt={`Slide ${i}`}
                        style={{ width: "100%", height: 300, objectFit: "cover" }}
                      />
                      <IconButton
                        onClick={() => onRemoveImage(i)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <CloseIcon color="error" />
                      </IconButton>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 0 }}>
              <TextField
                fullWidth
                label="Título/Legenda da seção"
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Descrição da seção"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                multiline
                rows={3}
                margin="normal"
              />

              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                <Button variant="contained" onClick={onOpenModal} color="primary">
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
