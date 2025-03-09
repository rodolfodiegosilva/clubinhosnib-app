import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./FeedItem.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface ImageData {
    file?: File;
    url: string;
    isLocalFile: boolean;
}

export interface FeedItemData {
    images: ImageData[];
    caption: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function FeedItem({ images, caption, description, createdAt, updatedAt }: FeedItemData) {
    return (
        <div className="feed-item">
            <div className="feed-item-content-wrapper">
                <div className="feed-item-carousel-container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        loop
                        className="feed-item-swiper-container"
                    >
                        {images.map((imgData, i) => (
                            <SwiperSlide key={i}>
                                <div className="feed-item-image-container">
                                    <img src={imgData.url} alt={`Slide ${i}`} className="feed-item-carousel-image" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="feed-item-content">
                    <h3 className="feed-item-title">{caption}</h3>
                    <p className="feed-item-description">{description}</p>
                    <div className="feed-item-timestamp-container">
                        <p className="feed-item-timestamp">
                            📅 Criado em: {new Date(createdAt).toLocaleDateString("pt-BR")} às {new Date(createdAt).toLocaleTimeString("pt-BR")}
                        </p>
                        <p className="feed-item-timestamp">
                            ⏳ Atualizado em: {new Date(updatedAt).toLocaleDateString("pt-BR")} às {new Date(updatedAt).toLocaleTimeString("pt-BR")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
