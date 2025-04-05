import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Modal,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CloseIcon from "@mui/icons-material/Close";
import DriveIcon from "@mui/icons-material/Google";
import CloudIcon from "@mui/icons-material/CloudQueue";
import FolderIcon from "@mui/icons-material/Folder";
import { useSelector } from "react-redux";
import { RootState } from "store/slices";
import { RoleUser } from "store/slices/auth/authSlice";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { SectionData } from "store/slices/image/imageSlice";

export interface SectionItemProps extends Omit<SectionData, "id"> {}

const formatDateTime = (value: string | Date) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString("pt-BR"),
    time: date.toLocaleTimeString("pt-BR"),
  };
};

const getPlatformIcon = (platform?: string) => {
  switch (platform) {
    case "googledrive":
      return <DriveIcon fontSize="small" />;
    case "onedrive":
    case "dropbox":
      return <CloudIcon fontSize="small" />;
    default:
      return <FolderIcon fontSize="small" />;
  }
};

const SectionImagePageView: React.FC<SectionItemProps> = ({
  caption,
  description,
  mediaItems,
  createdAt,
  updatedAt,
  public: isPublic,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isUserLogged = isAuthenticated && (user?.role === RoleUser.ADMIN || user?.role === RoleUser.USER);

  if (!isPublic && !isUserLogged) return null;
  if (!mediaItems || mediaItems.length === 0) return null;

  const created = createdAt ? formatDateTime(createdAt) : null;
  const updated = updatedAt ? formatDateTime(updatedAt) : null;

  const handleImageClick = (index: number) => {
    setStartIndex(index);
    setOpenModal(true);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 4 },
        mt: { xs: 1, sm: 1 },
        mb: { xs: 2, sm: 6 },
        borderRadius: 4,
        background: "linear-gradient(145deg, #fafafa, #f0f0f0)",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.01)" },
      }}
    >
      {/* Título e descrição */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {caption}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 800,
            mx: "auto",
            mb: 2,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>

        <Box
          mt={2}
          display="flex"
          flexDirection="column"
          alignItems={{ xs: "center", md: "flex-end" }}
          textAlign={{ xs: "center", md: "right" }}
        >
          {created && (
            <Typography variant="body2" color="text.secondary">
              📅 Criado em: {created.date} às {created.time}
            </Typography>
          )}
          {updated && (
            <Typography variant="body2" color="text.secondary">
              ⏳ Atualizado em: {updated.date} às {updated.time}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Imagem principal */}
      <Box mt={2}>
        <Box
          component="img"
          src={mediaItems[0].url}
          alt={mediaItems[0].title || "Imagem destaque"}
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: { xs: 500, sm: 800, md: 1000 },
            objectFit: "cover",
            borderRadius: 2,
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: 1,
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: 4,
            },
          }}
          onClick={() => handleImageClick(0)}
        />
      </Box>

      {/* Miniaturas */}
      <Grid container spacing={1} mt={1}>
        {mediaItems.slice(1).map((item, index) => (
          <Grid item xs={3} sm={2} md={1.5} key={item.id || index}>
            {item.url && (
              <Tooltip title={item.platform ?? "Imagem"} arrow>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                  onClick={() => handleImageClick(index + 1)}
                >
                  <Box
                    component="img"
                    src={item.url}
                    alt={item.title || `Miniatura ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: "50%",
                      p: 0.5,
                    }}
                  >
                    {getPlatformIcon(item.platform)}
                  </Box>
                </Box>
              </Tooltip>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1500,
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", top: 20, right: 20, color: "#fff" }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            initialSlide={startIndex}
            style={{ width: "90%", maxWidth: 900 }}
          >
            {mediaItems.map((media, index) => (
              <SwiperSlide key={media.id || index}>
                <Box
                  component="img"
                  src={media.url}
                  alt={media.title || `Slide ${index + 1}`}
                  sx={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Modal>
    </Paper>
  );
};

export default SectionImagePageView;
