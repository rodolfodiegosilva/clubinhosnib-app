import React, { useState } from "react";
import api from "../../../../config/axiosConfig"; // <-- instância axios configurada
import { GalleryItem } from "./GalleryItem";
import "./Gallery.css";
import { AddImageModal, ImageData } from "./AddImageModal";

/**
 * Interface que representa cada seção do feed:
 * - `images`: array de objetos (ImageData), contendo upload local ou link
 * - `caption`: legenda/título da seção
 * - `description`: texto descritivo
 */
export interface GalleryItemData {
  images: ImageData[];
  caption: string;
  description: string;
}

const initialImages: GalleryItemData[] = [
  {
    images: [
      {
        file: undefined,
        url: "https://my-portifolio-images.s3.us-east-2.amazonaws.com/profile.jpeg",
        isLocalFile: false,
      },
      {
        file: undefined,
        url: "https://my-portifolio-images.s3.us-east-2.amazonaws.com/profile.jpeg",
        isLocalFile: false,
      },
    ],
    caption: "Estamos na Reta Final das Visitas",
    description:
      "Acompanhe conosco uma das nossas visitas ao Salão, em um momento divertido de muitos ensinamentos, evangelismo e diversão.",
  },
  {
    images: [
      {
        file: undefined,
        url: "https://my-portifolio-images.s3.us-east-2.amazonaws.com/profile.jpeg",
        isLocalFile: false,
      },
    ],
    caption: "Homenagem Para os Líderes 2022",
    description:
      "No dia 08/03/2022 aconteceu uma programação diferente, nossos líderes à frente das equipes receberam uma homenagem pelo empenho e dedicação ao ministério.",
  },
  {
    images: [
      {
        file: undefined,
        url: "https://my-portifolio-images.s3.us-east-2.amazonaws.com/profile.jpeg",
        isLocalFile: false,
      },
    ],
    caption: "Visita à Cidade da Criança",
    description:
      "No dia 16/05/2022 fomos convidados pela Prefeitura de Manaus para realizar um evento especial para as crianças com contação de histórias e brincadeiras.",
  },
];

/**
 * Função para remover caracteres especiais do nome do arquivo
 */
const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase() // Substitui caracteres especiais
    .replace(/\s+/g, "_"); // Substitui espaços por underscores
};

/**
 * Componente principal que exibe as seções, gerencia o modal
 * e faz o envio final para a API apenas no "Salvar Tudo na API".
 */
export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItemData[]>(initialImages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);
  const [galleryTitle, setGalleryTitle] = useState("Feed do Ministério");
  const [galleryDescription, setGalleryDescription] = useState("Aqui você encontra fotos e notícias atuais do Ministério de Orfanato.");

  /** Abre o modal para adicionar imagem na seção de índice 'index' */
  const openModal = (index: number) => {
    setCurrentEditingIndex(index);
    setIsModalOpen(true);
  };

  /** Fecha modal sem salvar */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Ao confirmar no modal, recebemos um `ImageData`,
   * que terá `file` se o usuário fez upload ou `url` se for link.
   */
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

  /** Adiciona nova seção vazia */
  const addGalleryItem = () => {
    setGalleryItems((prev) => [
      ...prev,
      { images: [], caption: "", description: "" },
    ]);
  };

  /** Remove seção pelo índice */
  const removeGalleryItem = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  /** Adiciona imagem a uma seção */
  const addImageToGalleryItem = (index: number, newImage: ImageData) => {
    setGalleryItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, images: [...item.images, newImage] }
          : item
      )
    );
  };

  /** Remove imagem de uma seção */
  const removeImageFromGalleryItem = (itemIndex: number, imageIndex: number) => {
    setGalleryItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex
          ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) }
          : item
      )
    );
  };

  /** Atualiza caption de uma seção */
  const updateCaption = (index: number, newCaption: string) => {
    setGalleryItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, caption: newCaption } : item
      )
    );
  };

  /** Atualiza description de uma seção */
  const updateDescription = (index: number, newDescription: string) => {
    setGalleryItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, description: newDescription } : item
      )
    );
  };

  /**
   * Quando "Salvar Tudo na API" for clicado,
   * enviamos todos os dados (FormData) em uma única chamada:
   * - isLocalFile => envia File
   * - Link => envia url
   */
  const handleSaveAll = async () => {
    try {
      console.log("=== Iniciando handleSaveAll ===");

      const formData = new FormData();
      console.log("Construindo itemsPayload a partir do estado...");

      const itemsPayload = galleryItems.map((item, itemIndex) => {
        return {
          caption: item.caption,
          description: item.description,
          images: item.images.map((img, imgIndex) => {
            if (img.isLocalFile && img.file) {
              const sanitizedFileName = sanitizeFileName(img.file.name);
              const fieldName = `file_item${itemIndex}_img${imgIndex}_${sanitizedFileName}`;
              formData.append(fieldName, img.file);

              console.log(`Imagem local adicionada: ${fieldName}`, img.file);

              return {
                isLocalFile: true,
                fileFieldName: fieldName,
              };
            } else {
              console.log(`Imagem de URL adicionada: ${img.url}`);

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

      // Log do payload antes de enviar
      console.log("Payload enviado:", JSON.stringify(galleryData, null, 2));

      // Envia a requisição via axios
      const response = await api.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Resposta da API:", response.data);
      alert("Dados enviados com sucesso!");

      console.log("=== Fim de handleSaveAll ===");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Ocorreu um erro ao enviar. Verifique o console.");
    }
  };

  return (
    <div className="gallery-page">
      <input
        type="text"
        value={galleryTitle}
        onChange={(e) => setGalleryTitle(e.target.value)}
        className="gallery-title"
        placeholder="Título da Galeria"
      />
      <textarea
        value={galleryDescription}
        onChange={(e) => setGalleryDescription(e.target.value)}
        className="gallery-description"
        placeholder="Descrição da Galeria"
      />

      <div className="gallery">
        {galleryItems.map((item, index) => (
          <GalleryItem
            key={index}
            images={item.images}
            caption={item.caption}
            description={item.description}
            onCaptionChange={(newCaption) => updateCaption(index, newCaption)}
            onDescriptionChange={(newDescription) =>
              updateDescription(index, newDescription)
            }
            onRemoveImage={(imageIndex) =>
              removeImageFromGalleryItem(index, imageIndex)
            }
            onOpenModal={() => openModal(index)}
            onRemoveSection={() => removeGalleryItem(index)}
          />
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={addGalleryItem} className="add-section">
          Adicionar Nova Seção
        </button>
        <button onClick={handleSaveAll} className="save-all">
          Salvar Tudo na API
        </button>
      </div>

      <AddImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
