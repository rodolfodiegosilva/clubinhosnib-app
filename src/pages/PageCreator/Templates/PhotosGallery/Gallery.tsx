import React, { useState } from "react";
import api from "../../../../config/axiosConfig";
import { GalleryItem } from "./GalleryItem";
import { AddImageModal, ImageData } from "./AddImageModal";
import { ConfirmDialog } from "./ConfirmModal";
import { Notification } from "./NotificationModal";
import { LoadingSpinner } from "./LoadingSpinner";
import { Box, Button, Container, TextField } from "@mui/material";

export interface GalleryItemData {
  images: ImageData[];
  caption: string;
  description: string;
}

const initialImages: GalleryItemData[] = [];

const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase()
    .replace(/\s+/g, "_");
};

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItemData[]>(initialImages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});

  const [isSaving, setIsSaving] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = (index: number) => {
    setCurrentEditingIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (imageData: ImageData) => {
    if (imageData.file) {
      const sanitizedFileName = sanitizeFileName(imageData.file.name);
      const renamedFile = new File([imageData.file], sanitizedFileName, {
        type: imageData.file.type,
      });
      const objectUrl = URL.createObjectURL(renamedFile);
      imageData.file = renamedFile;
      imageData.url = objectUrl;
      imageData.isLocalFile = true;
    }
    if (currentEditingIndex !== null) {
      addImageToGalleryItem(currentEditingIndex, imageData);
    }
    closeModal();
  };

  const addGalleryItem = () => {
    setGalleryItems((prev) => [...prev, { images: [], caption: "", description: "" }]);
  };

  const removeGalleryItem = (index: number) => {
    setConfirmMessage("Tem certeza que deseja excluir esta seção?");
    setOnConfirmAction(() => () => {
      setGalleryItems((prev) => prev.filter((_, i) => i !== index));
    });
    setConfirmModalOpen(true);
  };

  const removeImageFromGalleryItem = (itemIndex: number, imageIndex: number) => {
    setConfirmMessage("Tem certeza que deseja excluir esta imagem?");
    setOnConfirmAction(() => () => {
      setGalleryItems((prev) =>
        prev.map((item, i) =>
          i === itemIndex ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) } : item
        )
      );
    });
    setConfirmModalOpen(true);
  };

  const addImageToGalleryItem = (index: number, newImage: ImageData) => {
    setGalleryItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, images: [...item.images, newImage] } : item))
    );
  };

  const updateCaption = (index: number, newCaption: string) => {
    setGalleryItems((prev) => prev.map((item, i) => (i === index ? { ...item, caption: newCaption } : item)));
  };

  const updateDescription = (index: number, newDescription: string) => {
    setGalleryItems((prev) => prev.map((item, i) => (i === index ? { ...item, description: newDescription } : item)));
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      const itemsPayload = galleryItems.map((item, itemIndex) => {
        return {
          caption: item.caption,
          description: item.description,
          images: item.images.map((img, imgIndex) => {
            if (img.isLocalFile && img.file) {
              const sanitizedFileName = sanitizeFileName(img.file.name);
              const fieldName = `file_item${itemIndex}_img${imgIndex}_${sanitizedFileName}`;
              formData.append(fieldName, img.file);
              return {
                isLocalFile: true,
                fileFieldName: fieldName,
              };
            } else {
              return {
                isLocalFile: false,
                url: img.url,
              };
            }
          }),
        };
      });

      const galleryData = {
        title: galleryTitle,
        description: galleryDescription,
        items: itemsPayload,
      };

      formData.append("galleryData", JSON.stringify(galleryData));
      await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessSnackbarOpen(true);
      setGalleryItems([]);
      setGalleryTitle("");
      setGalleryDescription("");
    } catch (error) {
      setErrorMessage("Erro ao enviar dados. Verifique o console.");
      setErrorSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", p: 0 }}>
      <LoadingSpinner open={isSaving} />
      <ConfirmDialog
        open={confirmModalOpen}
        title="Confirmação"
        message={confirmMessage}
        onConfirm={() => {
          onConfirmAction();
          setConfirmModalOpen(false);
        }}
        onCancel={() => setConfirmModalOpen(false)}
      />
      <Notification
        open={successSnackbarOpen}
        message="Página criada com sucesso!"
        severity="success"
        onClose={() => setSuccessSnackbarOpen(false)}
      />

      <Notification
        open={errorSnackbarOpen}
        message="Erro em salvar página."
        severity="error"
        onClose={() => setErrorSnackbarOpen(false)}
      />

      <Box mb={2}>
        <TextField
          fullWidth
          label="Título da Galeria"
          value={galleryTitle}
          onChange={(e) => setGalleryTitle(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descrição da Galeria"
          value={galleryDescription}
          onChange={(e) => setGalleryDescription(e.target.value)}
          variant="outlined"
          multiline
          rows={3}
        />
      </Box>

      {galleryItems.map((item, index) => (
        <GalleryItem
          key={index}
          images={item.images}
          caption={item.caption}
          description={item.description}
          onCaptionChange={(newCaption) => updateCaption(index, newCaption)}
          onDescriptionChange={(newDescription) => updateDescription(index, newDescription)}
          onRemoveImage={(imageIndex) => removeImageFromGalleryItem(index, imageIndex)}
          onOpenModal={() => openModal(index)}
          onRemoveSection={() => removeGalleryItem(index)}
        />
      ))}

      <Box mt={3} display="flex" gap={2} flexWrap="wrap">
        <Button variant="contained" onClick={addGalleryItem} color="primary">
          + Nova Seção
        </Button>
        <Button variant="contained" onClick={handleSaveAll} color="success">
          Salvar
        </Button>
      </Box>

      <AddImageModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleModalSubmit} />
    </Container>
  );
}