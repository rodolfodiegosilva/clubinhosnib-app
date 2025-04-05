import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { MediaItem } from "../../../../../store/slices/image/imageSlice";

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (media: MediaItem) => void;
}

export function AddImageModal({ isOpen, onClose, onSubmit }: AddImageModalProps) {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [tempUrl, setTempUrl] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [platform, setPlatform] = useState<"ANY" | "googledrive" | "onedrive" | "dropbox">("ANY");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setTempUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const reset = () => {
    setFile(null);
    setTempUrl("");
    setUrlInput("");
    setTitle("");
    setDescription("");
    setPlatform("ANY");
    setMode("upload");
  };

  const handleSubmit = () => {
    const base: Partial<MediaItem> = {
      title: title.trim(),
      description: description.trim(),
      type: mode,
      isLocalFile: mode === "upload",
    };

    if (mode === "upload" && file) {
      onSubmit({
        ...base,
        file,
        url: "",
        originalName: file.name,
        size: file.size,
        mediaType: "image",
      } as MediaItem);
    }

    if (mode === "link" && urlInput.trim()) {
      onSubmit({
        ...base,
        url: urlInput.trim(),
        file: undefined,
        platform,
      } as MediaItem);
    }

    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Adicionar Nova Imagem</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Título da imagem (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Descrição da imagem (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Modo de envio</InputLabel>
          <Select
            value={mode}
            label="Modo de envio"
            onChange={(e) => setMode(e.target.value as "upload" | "link")}
          >
            <MenuItem value="upload">Upload</MenuItem>
            <MenuItem value="link">Link</MenuItem>
          </Select>
        </FormControl>

        {mode === "upload" && (
          <>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 1 }}
            >
              Upload da imagem
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) setFile(selected);
                }}
              />
            </Button>

            {tempUrl && (
              <Box mt={2} textAlign="center">
                <img
                  src={tempUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", borderRadius: 8 }}
                />
              </Box>
            )}
          </>
        )}

        {mode === "link" && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Plataforma</InputLabel>
              <Select
                value={platform}
                label="Plataforma"
                onChange={(e) => setPlatform(e.target.value as any)}
              >
                <MenuItem value="ANY">Outro</MenuItem>
                <MenuItem value="googledrive">Google Drive</MenuItem>
                <MenuItem value="onedrive">OneDrive</MenuItem>
                <MenuItem value="dropbox">Dropbox</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="URL da imagem"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              margin="normal"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mode === "upload" ? !file : !urlInput.trim()}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
