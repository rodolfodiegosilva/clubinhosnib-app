import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Box, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ImageData } from "./AddImageModal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PhotosItemProps {
  images: ImageData[];
  onRemoveImage: (imageIndex: number) => void;
}

export default function PhotosItem({ images, onRemoveImage }: PhotosItemProps) {
  if (images.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Nenhuma imagem adicionada nesta seção.
      </Alert>
    );
  }

  return (
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
  );
}
