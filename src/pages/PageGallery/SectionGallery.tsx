import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GalleryImageData } from "../../store/slices/gallery/gallerySlice";

export interface GalleryItemData {
  images: GalleryImageData[];
  caption: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeedItem({ images, caption, description, createdAt, updatedAt }: GalleryItemData) {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {caption}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>

          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              📅 Criado em: {new Date(createdAt).toLocaleDateString("pt-BR")} às {new Date(createdAt).toLocaleTimeString("pt-BR")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ⏳ Atualizado em: {new Date(updatedAt).toLocaleDateString("pt-BR")} às {new Date(updatedAt).toLocaleTimeString("pt-BR")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}