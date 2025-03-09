import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ImageData } from "./AddImageModal";

import "./GalleryItem.css";

// Estilos básicos do Swiper
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
    <div className="gallery-item">
      {/* Carrossel */}
      <div className="carousel-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="swiper-container"
        >
          {images.map((imgData, i) => (
            <SwiperSlide key={i}>
              <div className="image-container">
                {/* Exibimos imgData.url seja link ou objectURL */}
                <img src={imgData.url} alt={`Slide ${i}`} className="carousel-image" />
                <button className="delete-button" onClick={() => onRemoveImage(i)}>
                  x
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Área de texto e botões */}
      <div className="feed-content">
        <input
          type="text"
          value={caption}
          placeholder="Título/Legenda da seção"
          onChange={(e) => onCaptionChange(e.target.value)}
        />
        <textarea
          value={description}
          placeholder="Descrição da seção"
          onChange={(e) => onDescriptionChange(e.target.value)}
        />

        <button onClick={onOpenModal}>Adicionar Imagem</button>
        <button onClick={onRemoveSection}>Excluir Seção</button>
      </div>
    </div>
  );
}
