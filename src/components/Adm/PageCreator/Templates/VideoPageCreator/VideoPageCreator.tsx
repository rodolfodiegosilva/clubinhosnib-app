import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import api from "../../../../../config/axiosConfig";
import { AppDispatch, RootState } from "../../../../../store/slices";
import { fetchRoutes } from "../../../../../store/slices/route/routeSlice";
import { clearVideoData, VideoItem } from "../../../../../store/slices/video/videoSlice";
import { validateMediaURL } from "../../../../../utils/validateMediaURL";
import VideoForm from "./VideoForm";
import VideoList from "./VideoList";

interface VideoProps {
  fromTemplatePage?: boolean;
}

function videoToEditable(video: VideoItem): VideoItem {
  return {
    ...video,
    file: undefined, // Remove o arquivo para evitar reenvio no modo de edição
  };
}

export default function VideoPageCreator({ fromTemplatePage = false }: VideoProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const videoData = useSelector((state: RootState) => state.video.videoData);

  // Estados principais
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newVideo, setNewVideo] = useState<VideoItem>({
    title: "",
    description: "",
    type: "link",
    platform: "youtube",
    url: "",
    isLocalFile: false,
    mediaType: "video",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    pageTitle: false,
    pageDescription: false,
    newVideoTitle: false,
    newVideoDescription: false,
    newVideoSrc: false,
    newVideoURL: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  // Estado para o modal de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDeleteIndex, setVideoToDeleteIndex] = useState<number | null>(null);
  // Estado para indicar progresso de upload
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});

  // Carregamento inicial
  useEffect(() => {
    if (!videoData && !fromTemplatePage) {
      navigate("/feed-clubinho");
      return;
    }
    if (fromTemplatePage) {
      dispatch(clearVideoData());
      setTitle("");
      setDescription("");
      setVideos([]);
      setIsPublic(true);
    } else if (videoData) {
      setTitle(videoData.title ?? "");
      setDescription(videoData.description ?? "");
      setIsPublic(videoData.public ?? true);
      setVideos(videoData.videos.map(videoToEditable));
    }
  }, [fromTemplatePage, videoData, dispatch, navigate]);

  // Verificar se todos os uploads estão completos
  const areUploadsComplete = () => {
    return Object.values(uploadProgress).every((isComplete) => isComplete !== false);
  };

  // Validação
  const validate = (): boolean => {
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, pageTitle: true }));
      setSnackbarMessage("O título da galeria é obrigatório.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    if (!description.trim()) {
      setErrors((prev) => ({ ...prev, pageDescription: true }));
      setSnackbarMessage("A descrição da galeria é obrigatória.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    if (videos.length === 0) {
      setSnackbarMessage("Adicione pelo menos um vídeo.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    if (!fromTemplatePage && !videoData?.id) {
      setSnackbarMessage("ID da página é obrigatório no modo de edição.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    if (!areUploadsComplete()) {
      setSnackbarMessage("Aguarde o upload de todos os vídeos antes de salvar.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  // Função para salvar a página
  const handleSavePage = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();

      const videosPayload = videos.map((video, index) => {
        const fieldKey = `video-${index}`;
        // Anexar arquivo apenas para novos vídeos do tipo upload
        if (video.type === "upload" && video.file && !video.id) {
          formData.append(fieldKey, video.file);
        }

        const baseVideo = {
          title: video.title,
          description: video.description,
          type: video.type,
          isLocalFile: video.type === "upload",
          url: video.type === "link" || (video.type === "upload" && video.id) ? video.url : undefined,
          platform: video.type === "link" ? video.platform : undefined,
          originalName: video.file?.name,
          mediaType: "video",
          fieldKey: video.type === "upload" && !video.id ? fieldKey : undefined,
        };

        // Incluir id para vídeos existentes no modo de edição
        return !fromTemplatePage && video.id ? { ...baseVideo, id: video.id } : baseVideo;
      });

      const payload = fromTemplatePage
        ? {
          public: isPublic,
          title,
          description,
          videos: videosPayload,
        }
        : {
          id: videoData!.id, // Garantir que o id da página esteja presente
          public: isPublic,
          title,
          description,
          videos: videosPayload,
        };

      formData.append("videosPageData", JSON.stringify(payload));

      const response = fromTemplatePage
        ? await api.post("/video-pages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        : await api.patch(`/video-pages/${videoData!.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      await dispatch(fetchRoutes());
      navigate(`/${response.data.route.path}`);
      setSnackbarMessage(fromTemplatePage ? "Página criada com sucesso!" : "Página atualizada com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao salvar página", error);
      setSnackbarMessage("Erro ao salvar a página. Tente novamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar ou atualizar vídeo
  const handleAddVideo = () => {
    const hasError =
      !newVideo.title ||
      !newVideo.description ||
      (newVideo.type === "link" && !newVideo.url) ||
      (newVideo.type === "upload" && !newVideo.file && editingIndex === null);
    const isValidURL =
      newVideo.type === "link" && newVideo.platform
        ? validateMediaURL(newVideo.url || "", newVideo.platform)
        : true;

    setErrors((prev) => ({
      ...prev,
      newVideoTitle: !newVideo.title,
      newVideoDescription: !newVideo.description,
      newVideoSrc:
        newVideo.type === "link" ? !newVideo.url : !newVideo.file && editingIndex === null,
      newVideoURL: newVideo.type === "link" && !isValidURL,
    }));

    if (hasError || !isValidURL) {
      if (!isValidURL) {
        setSnackbarMessage("URL inválida para a plataforma selecionada.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      return;
    }

    const videoToAdd: VideoItem = {
      ...newVideo,
      id: editingIndex !== null ? videos[editingIndex].id : undefined,
      isLocalFile: newVideo.type === "upload",
      mediaType: "video",
    };

    if (editingIndex !== null) {
      setVideos((prev) => prev.map((v, i) => (i === editingIndex ? videoToAdd : v)));
      setEditingIndex(null);
      setSnackbarMessage("Vídeo atualizado com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setVideos([...videos, videoToAdd]);
    }

    if (newVideo.type === "upload" && newVideo.file) {
      setUploadProgress((prev) => ({
        ...prev,
        [newVideo.file.name]: true,
      }));
    }

    setNewVideo({
      title: "",
      description: "",
      type: "link",
      platform: "youtube",
      url: "",
      isLocalFile: false,
      mediaType: "video",
    });
  };

  // Função para abrir o modal de confirmação de exclusão
  const handleOpenDeleteDialog = (index: number) => {
    setVideoToDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  // Função para fechar o modal de exclusão
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVideoToDeleteIndex(null);
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = () => {
    if (videoToDeleteIndex !== null) {
      setVideos((prev) => prev.filter((_, i) => i !== videoToDeleteIndex));
      if (editingIndex === videoToDeleteIndex) {
        setEditingIndex(null);
        setNewVideo({
          title: "",
          description: "",
          type: "link",
          platform: "youtube",
          url: "",
          isLocalFile: false,
          mediaType: "video",
        });
      }
      setSnackbarMessage("Vídeo removido com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
    handleCloseDeleteDialog();
  };

  const handleEditVideo = (index: number) => {
    const videoToEdit = videos[index];
    setNewVideo({ ...videoToEdit, file: undefined });
    setEditingIndex(index);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress((prev) => ({
      ...prev,
      [file.name]: false,
    }));

    const previewUrl = URL.createObjectURL(file);
    setNewVideo((prev) => ({
      ...prev,
      file,
      url: previewUrl,
      isLocalFile: true,
      platform: undefined,
    }));

    setTimeout(() => {
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: true,
      }));
    }, 1000);
  };

  return (
    <Container maxWidth={false} sx={{ mt: { xs: 0, md: 6 } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={{ xs: 2, md: 3 }}
        textAlign="center"
        sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
      >
        {fromTemplatePage ? "Criar Galeria de Vídeos" : "Editar Galeria de Vídeos"}
      </Typography>

      <Box mb={2}>
        <TextField
          fullWidth
          label="Título da Galeria"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          error={errors.pageTitle}
          helperText={errors.pageTitle ? "Campo obrigatório" : ""}
        />
        <TextField
          fullWidth
          label="Descrição da Galeria"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          error={errors.pageDescription}
          helperText={errors.pageDescription ? "Campo obrigatório" : ""}
        />
        <FormControlLabel
          control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
          label="Página pública"
          sx={{ mt: 1 }}
        />
      </Box>

      <VideoForm
        newVideo={newVideo}
        errors={errors}
        setNewVideo={setNewVideo}
        handleUploadFile={handleUploadFile}
        handleAddVideo={handleAddVideo}
        isEditing={editingIndex !== null}
        uploadProgress={uploadProgress}
      />

      <VideoList
        videos={videos}
        handleRemoveVideo={handleOpenDeleteDialog}
        handleEditVideo={handleEditVideo}
      />

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleSavePage}
          disabled={loading || !areUploadsComplete()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Salvando..." : "Salvar Página"}
        </Button>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}