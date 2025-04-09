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
import { AppDispatch, RootState } from "../../../../../store/slices";
import { fetchRoutes } from "../../../../../store/slices/route/routeSlice";
import {
  clearWeekMaterialData,
  WeekMediaItem,
} from "../../../../../store/slices/week-material/weekMaterialSlice";

import WeekVideos from "./WeekVideos";
import WeekDocuments from "./WeekDocuments";
import WeekAudios from "./WeekAudios";
import api from "../../../../../config/axiosConfig";
import WeekImages from "./WeekImages";

interface WeekMaterialPageCreatorProps {
  fromTemplatePage?: boolean;
}

export default function WeekMaterialPageCreator({
  fromTemplatePage,
}: WeekMaterialPageCreatorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const studyData = useSelector((state: RootState) => state.weekMaterial.studyMaterialData);

  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [tab, setTab] = useState(0);

  const [videos, setVideos] = useState<WeekMediaItem[]>([]);
  const [documents, setDocuments] = useState<WeekMediaItem[]>([]);
  const [images, setImages] = useState<WeekMediaItem[]>([]);
  const [audios, setAudios] = useState<WeekMediaItem[]>([]);

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

  useEffect(() => {
    if (fromTemplatePage) {
      dispatch(clearWeekMaterialData());
      setPageTitle("");
      setPageSubtitle("");
      setPageDescription("");
      setVideos([]);
      setDocuments([]);
      setImages([]);
      setAudios([]);
    }
  }, [fromTemplatePage, dispatch]);

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
          id: v.id,
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
          id: d.id,
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
          id: i.id,
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
          id: a.id,
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

      formData.append("weekMaterialsPageData", JSON.stringify(payload));

      const res = fromTemplatePage
        ? await api.post("/week-material-pages", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.patch(`/week-material-pages/${studyData?.id}`, formData, {
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
      <Typography variant="h3" mb={3} fontWeight="bold" textAlign="center"  sx={{ mt: { xs: 0, md: 0 }, mb: { xs: 1, md: 3 }, fontSize: { xs: "1.5rem", md: "2rem" } }}>
        {fromTemplatePage ? "Adicionar Semana" : "Editar Semana"}
      </Typography>

      <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        <TextField
          label="Semana"
          fullWidth
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          error={errors.title}
          helperText={errors.title ? "Campo obrigatório" : ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Tema da Semana"
          fullWidth
          value={pageSubtitle}
          onChange={(e) => setPageSubtitle(e.target.value)}
          error={errors.subtitle}
          helperText={errors.subtitle ? "Campo obrigatório" : ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descrição do Tema da Semana"
          fullWidth
          multiline
          rows={3}
          value={pageDescription}
          onChange={(e) => setPageDescription(e.target.value)}
          error={errors.description}
          helperText={errors.description ? "Campo obrigatório" : ""}
        />
      </Box>
      <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
        {fromTemplatePage ? "Materiais da Semana" : "Materiais da Semana"}
      </Typography>

      <Tabs value={tab} onChange={(_, val) => setTab(val)} centered>
        <Tab label="Vídeos" />
        <Tab label="Doc" />
        <Tab label="Img" />
        <Tab label="Áudio" />
      </Tabs>
      <Divider sx={{ my: 3 }} />

      {tab === 0 && <WeekVideos videos={videos} setVideos={setVideos} />}
      {tab === 1 && <WeekDocuments documents={documents} setDocuments={setDocuments} />}
      {tab === 2 && <WeekImages images={images} setImages={setImages} />}
      {tab === 3 && <WeekAudios audios={audios} setAudios={setAudios} />}

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


 interface FileItem {
  type: "upload" | "link";
  url?: string;
  file?: File;
  [key: string]: any;
}

/**
 * Adiciona um arquivo de upload ao FormData e retorna o item com `fileField` para referência no JSON.
 * Suporta múltiplos tipos: vídeo, imagem, documento e áudio.
 */
 function buildFileItem<T extends FileItem>(
  item: T,
  index: number,
  prefix: string,
  formData: FormData
): T & { fileField?: string } {
  if (item.type === "upload" && item.file instanceof File) {
    const extension = item.file.name.split(".").pop() || "bin";
    const filename = `${prefix}_${index}.${extension}`;
    formData.append(filename, item.file, filename);

    return {
      ...item,
      url: undefined, // removemos a prévia usada no front
      fileField: filename,
    };
  }

  return {
    ...item,
    fileField: undefined,
  };
}
