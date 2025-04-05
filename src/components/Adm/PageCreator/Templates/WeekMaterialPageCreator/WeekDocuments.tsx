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
  DialogActions,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { validateMediaURL } from "utils/validateMediaURL";
import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";

interface Props {
  documents: WeekMediaItem[];
  setDocuments: (docs: WeekMediaItem[]) => void;
}

export default function WeekDocuments({ documents, setDocuments }: Props) {
  const [newDoc, setNewDoc] = useState<WeekMediaItem>({
    title: "",
    description: "",
    type: "link",
    platform: "googledrive",
    url: "",
  });
  const [fileName, setFileName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    url: false,
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setNewDoc((prev) => ({ ...prev, url, file }));
  };

  const handleAddOrUpdate = () => {
    const isValid = newDoc.type === "upload" || validateMediaURL(newDoc.url, newDoc.platform);
    const hasError =
      !newDoc.title || !newDoc.description || !newDoc.url || (newDoc.type === "link" && !isValid);

    setErrors({
      title: !newDoc.title,
      description: !newDoc.description,
      url: !newDoc.url || (newDoc.type === "link" && !isValid),
    });

    if (hasError) return;

    const updated = [...documents];
    if (editingIndex !== null) {
      updated[editingIndex] = newDoc;
      setEditingIndex(null);
    } else {
      updated.push(newDoc);
    }

    setDocuments(updated);
    setNewDoc({
      title: "",
      description: "",
      type: "link",
      platform: "googledrive",
      url: "",
    });
    setFileName("");
  };

  const handleEdit = (index: number) => {
    setNewDoc(documents[index]);
    setEditingIndex(index);
    setFileName(documents[index].file?.name || "");
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setDocuments(documents.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
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
                  url: "",
                  file: undefined,
                  platform: "googledrive",
                }))
              }
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {newDoc.type === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={newDoc.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setNewDoc((prev) => ({
                      ...prev,
                      platform: e.target.value as WeekMediaItem["platform"],
                    }))
                  }
                >
                  <MenuItem value="googledrive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="URL do Documento"
                fullWidth
                value={newDoc.url}
                onChange={(e) => setNewDoc((prev) => ({ ...prev, url: e.target.value }))}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {newDoc.type === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Documento
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleUpload} />
            </Button>
            {fileName && (
              <Typography variant="body2" mt={1}>
                Arquivo selecionado: <strong>{fileName}</strong>
              </Typography>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleAddOrUpdate}>
            {editingIndex !== null ? "Salvar Alterações" : "Adicionar Documento"}
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
                {doc.type === "upload" && (
                  <Tooltip title="Visualizar">
                    <IconButton color="primary" onClick={() => setPreviewDoc(doc.url)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton color="error" onClick={() => setDeleteIndex(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!previewDoc} onClose={() => setPreviewDoc(null)} maxWidth="md" fullWidth>
        <DialogTitle>Visualizar Documento</DialogTitle>
        <DialogContent>
          {previewDoc?.startsWith("data:") || previewDoc?.startsWith("blob:") ? (
            <iframe
              src={previewDoc}
              title="Documento"
              style={{ width: "100%", height: "80vh", border: 0 }}
            />
          ) : (
            <Typography>
              Visualização disponível apenas para arquivos enviados. Links devem ser abertos externamente.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente remover este documento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmRemove}>Remover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
