import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

export interface ImageData {
  file?: File;
  url: string;
  isLocalFile: boolean;
}

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (imageData: ImageData) => void;
}

export function AddImageModal({ isOpen, onClose, onSubmit }: AddImageModalProps) {
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tempUrl, setTempUrl] = useState("");

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setTempUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleSubmit = () => {
    if (file) {
      onSubmit({ file, url: tempUrl, isLocalFile: true });
    } else if (urlInput.trim()) {
      onSubmit({ file: undefined, url: urlInput.trim(), isLocalFile: false });
    }

    setUrlInput("");
    setFile(null);
    setTempUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Adicionar Nova Imagem</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="URL da imagem"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          margin="dense"
        />

        <Typography align="center" sx={{ my: 2 }}>
          ou
        </Typography>

        <Button variant="outlined" component="label" fullWidth>
          Fazer upload da imagem
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </Button>

        {tempUrl && (
          <Box mt={2} textAlign="center">
            <img src={tempUrl} alt="Preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
