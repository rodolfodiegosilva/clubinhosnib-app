import React, { useState, useEffect } from "react";
import "./AddImageModal.css";

// Definindo o tipo de cada imagem
export interface ImageData {
  file?: File;       // se for upload
  url: string;       // se for link ou objectURL
  isLocalFile: boolean;
}

interface AddImageModalProps {
  isOpen: boolean;                 // controla se o modal aparece
  onClose: () => void;             // fechar modal
  onSubmit: (imageData: ImageData) => void; 
}

export function AddImageModal({
  isOpen,
  onClose,
  onSubmit,
}: AddImageModalProps) {
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tempUrl, setTempUrl] = useState("");

  // Cria e remove URL temporária para preview local
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setTempUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (file) {
      // usuário fez upload do arquivo
      onSubmit({
        file,
        url: tempUrl,   // objectURL para exibir localmente
        isLocalFile: true,
      });
    } else if (urlInput.trim()) {
      // usuário digitou link
      onSubmit({
        file: undefined,
        url: urlInput.trim(),
        isLocalFile: false,
      });
    }

    setUrlInput("");
    setFile(null);
    setTempUrl("");
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Adicionar Nova Imagem</h3>

        <input
          type="text"
          placeholder="Insira o URL da imagem"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <p style={{ textAlign: "center", margin: "10px 0" }}>ou</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>Adicionar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
