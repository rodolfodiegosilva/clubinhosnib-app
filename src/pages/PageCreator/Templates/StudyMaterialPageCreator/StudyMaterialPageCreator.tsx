import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/slices";
import { fetchRoutes } from "../../../../store/slices/route/routeSlice";
import {
  clearStudyMaterialData,
  StudyMediaItem,
} from "../../../../store/slices/study-material/studyMaterialSlice";

import StudyVideos from "./StudyVideos";
import StudyDocuments from "./StudyDocuments";
import StudyImages from "./StudyImages";
import StudyAudios from "./StudyAudios";
import { buildFileItem } from "../../../../utils/formDataHelpers";
import api from "../../../../config/axiosConfig";

interface StudyMaterialPageCreatorProps {
  fromTemplatePage?: boolean;
}

export default function StudyMaterialPageCreator({
  fromTemplatePage,
}: StudyMaterialPageCreatorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const studyData = useSelector((state: RootState) => state.studyMaterial.studyMaterialData);

  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [tab, setTab] = useState(0);

  const [videos, setVideos] = useState<StudyMediaItem[]>([]);
  const [documents, setDocuments] = useState<StudyMediaItem[]>([]);
  const [images, setImages] = useState<StudyMediaItem[]>([]);
  const [audios, setAudios] = useState<StudyMediaItem[]>([]);

  const [errors, setErrors] = useState({
    title: false,
    subtitle: false,
    description: false,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // MODO TEMPLATE (criação): limpa tudo
  useEffect(() => {
    if (fromTemplatePage) {
      dispatch(clearStudyMaterialData());
      setPageTitle("");
      setPageSubtitle("");
      setPageDescription("");
      setVideos([]);
      setDocuments([]);
      setImages([]);
      setAudios([]);
    }
  }, [fromTemplatePage, dispatch]);

  // MODO EDIÇÃO: carrega dados do Redux
  useEffect(() => {
    if (!fromTemplatePage && studyData) {
      setPageTitle(studyData.title);
      setPageSubtitle(studyData.subtitle);
      setPageDescription(studyData.description);
      setVideos(studyData.videos);
      setDocuments(studyData.documents);
      setImages(studyData.images);
      setAudios(studyData.audios);
    }
  }, [fromTemplatePage, studyData]);

  const handleSavePage = async () => {
    const hasError =
      !pageTitle ||
      !pageSubtitle ||
      !pageDescription ||
      (!videos.length && !documents.length && !images.length && !audios.length);

    setErrors({
      title: !pageTitle,
      subtitle: !pageSubtitle,
      description: !pageDescription,
    });

    if (hasError) {
      setSnackbar({
        open: true,
        message: "Preencha todos os campos obrigatórios e adicione ao menos um material.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const processedVideos = videos.map((v, i) => buildFileItem(v, i, "video", formData));
      const processedDocs = documents.map((d, i) => buildFileItem(d, i, "document", formData));
      const processedImgs = images.map((i, n) => buildFileItem(i, n, "image", formData));
      const processedAudios = audios.map((a, x) => buildFileItem(a, x, "audio", formData));

      const payload = {
        id: fromTemplatePage ? undefined : studyData?.id,
        pageTitle,
        pageSubtitle,
        pageDescription,
        videos: processedVideos.map((v) => ({
          title: v.title,
          description: v.description,
          type: v.type,
          platform: v.platform,
          url: v.url || '',
          fileField: v.fileField || '',
          isLocalFile: v.isLocalFile ?? (v.type === "upload" ? true : false),    
          size: v.size,
        })),
        documents: processedDocs.map((d) => ({
          title: d.title,
          description: d.description,
          type: d.type,
          platform: d.platform,
          url:  d.url || '',
          fileField: d.fileField || '',
          isLocalFile: d.isLocalFile ?? (d.type === "upload" ? true : false),    
          size: d.size,
        })),
        images: processedImgs.map((i) => ({
          title: i.title,
          description: i.description,
          type: i.type,
          platform: i.platform,
          url: i.url || '',
          fileField: i.fileField || '',
          isLocalFile: i.isLocalFile ?? (i.type === "upload" ? true : false),    
          size: i.size,
        })),
        audios: processedAudios.map((a) => ({
          title: a.title,
          description: a.description,
          type: a.type,
          platform: a.platform,
          url:  a.url || '',
          fileField:  a.fileField || '',
          isLocalFile: a.isLocalFile ?? (a.type === "upload" ? true : false),    
          size: a.size,
        })),
      };

      formData.append("studyMaterialsPageData", JSON.stringify(payload));

      const res = fromTemplatePage
        ? await api.post("/study-materials-page", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.patch(`/study-materials-page/${studyData?.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (!res?.data) throw new Error("Erro ao salvar");

      await dispatch(fetchRoutes());

      setSnackbar({
        open: true,
        message: "Página salva com sucesso!",
        severity: "success",
      });

      navigate(`/${res.data.route.path}`);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setSnackbar({
        open: true,
        message: "Erro ao salvar a página.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0, m: 0, mt: fromTemplatePage ? 0 : 10, width: "98%", maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" mb={3} fontWeight="bold" textAlign="center">
        {fromTemplatePage ? "Criar Página de Materiais de Estudo" : "Editar Página de Materiais de Estudo"}
      </Typography>

      <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        <TextField
          label="Título da Página"
          fullWidth
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          error={errors.title}
          helperText={errors.title ? "Campo obrigatório" : ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Subtítulo da Página"
          fullWidth
          value={pageSubtitle}
          onChange={(e) => setPageSubtitle(e.target.value)}
          error={errors.subtitle}
          helperText={errors.subtitle ? "Campo obrigatório" : ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descrição da Página"
          fullWidth
          multiline
          rows={3}
          value={pageDescription}
          onChange={(e) => setPageDescription(e.target.value)}
          error={errors.description}
          helperText={errors.description ? "Campo obrigatório" : ""}
        />
      </Box>

      <Tabs value={tab} onChange={(_, val) => setTab(val)} centered>
        <Tab label="Vídeos" />
        <Tab label="Doc" />
        <Tab label="Img" />
        <Tab label="Áudio" />
      </Tabs>
      <Divider sx={{ my: 3 }} />

      {tab === 0 && <StudyVideos videos={videos} setVideos={setVideos} />}
      {tab === 1 && <StudyDocuments documents={documents} setDocuments={setDocuments} />}
      {tab === 2 && <StudyImages images={images} setImages={setImages} />}
      {tab === 3 && <StudyAudios audios={audios} setAudios={setAudios} />}

      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSavePage}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Salvando..." : "Salvar Página"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
