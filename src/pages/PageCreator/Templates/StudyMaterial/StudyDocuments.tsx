import {
    Box,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
  } from "@mui/material";
  import { Delete, Visibility } from "@mui/icons-material";
  import { useState } from "react";
  
  interface DocumentItem {
    title: string;
    description: string;
    type: "upload" | "link";
    platform?: "google-drive" | "onedrive";
    src: string;
  }
  
  interface Props {
    documents: DocumentItem[];
    setDocuments: (docs: DocumentItem[]) => void;
  }
  
  export default function StudyDocuments({ documents, setDocuments }: Props) {
    const [newDoc, setNewDoc] = useState<DocumentItem>({
      title: "",
      description: "",
      type: "link",
      platform: "google-drive",
      src: "",
    });
  
    const [errors, setErrors] = useState({
      title: false,
      description: false,
      src: false,
    });
  
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setNewDoc((prev) => ({ ...prev, src: reader.result as string }));
      };
      reader.readAsDataURL(file);
    };
  
    const handleAdd = () => {
      const hasError = !newDoc.title || !newDoc.description || !newDoc.src;
      setErrors({
        title: !newDoc.title,
        description: !newDoc.description,
        src: !newDoc.src,
      });
      if (hasError) return;
      setDocuments([...documents, newDoc]);
      setNewDoc({ title: "", description: "", type: "link", platform: "google-drive", src: "" });
    };
  
    const handleRemove = (index: number) => {
      setDocuments(documents.filter((_, i) => i !== index));
    };
  
    return (
      <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título do Documento"
              fullWidth
              value={newDoc.title}
              onChange={(e) => setNewDoc((prev) => ({ ...prev, title: e.target.value }))}
              error={errors.title}
              helperText={errors.title ? "Campo obrigatório" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Descrição do Documento"
              fullWidth
              value={newDoc.description}
              onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
              error={errors.description}
              helperText={errors.description ? "Campo obrigatório" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={newDoc.type}
                label="Tipo"
                onChange={(e) =>
                  setNewDoc((prev) => ({
                    ...prev,
                    type: e.target.value as "upload" | "link",
                    platform: e.target.value === "link" ? "google-drive" : undefined,
                    src: "",
                  }))
                }
              >
                <MenuItem value="link">Link</MenuItem>
                <MenuItem value="upload">Upload</MenuItem>
              </Select>
            </FormControl>
          </Grid>
  
          {newDoc.type === "link" && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={newDoc.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setNewDoc((prev) => ({
                      ...prev,
                      platform: e.target.value as DocumentItem["platform"],
                    }))
                  }
                >
                  <MenuItem value="google-drive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
  
          {newDoc.type === "link" && (
            <Grid item xs={12}>
              <TextField
                label="URL do Documento"
                fullWidth
                value={newDoc.src}
                onChange={(e) => setNewDoc((prev) => ({ ...prev, src: e.target.value }))}
                error={errors.src}
                helperText={errors.src ? "Campo obrigatório" : ""}
              />
            </Grid>
          )}
  
          {newDoc.type === "upload" && (
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload de Documento
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleUpload} />
              </Button>
            </Grid>
          )}
  
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleAdd}>
              Adicionar Documento
            </Button>
          </Grid>
        </Grid>
  
        <Grid container spacing={3} mt={4}>
          {documents.map((doc, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box border={1} borderRadius={2} p={2} position="relative">
                <Typography fontWeight="bold">{doc.title}</Typography>
                <Typography variant="body2" mb={1}>{doc.description}</Typography>
                <Box display="flex" gap={1} mt={1}>
                  <IconButton color="primary" onClick={() => setPreviewDoc(doc.src)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRemove(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
  
        <Dialog open={!!previewDoc} onClose={() => setPreviewDoc(null)} maxWidth="md" fullWidth>
          <DialogTitle>Visualizar Documento</DialogTitle>
          <DialogContent>
            {previewDoc?.includes("data:") ? (
              <iframe
                src={previewDoc}
                title="Documento"
                style={{ width: "100%", height: "80vh", border: 0 }}
              />
            ) : (
              <Typography>
                Visualização apenas disponível para arquivos enviados. Links devem ser abertos externamente.
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  }