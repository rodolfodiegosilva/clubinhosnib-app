import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import StudyVideos from "./StudyVideos";
import StudyDocuments from "./StudyDocuments";
import StudyImages from "./StudyImages";

interface VideoItem {
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "youtube" | "google-drive" | "onedrive";
  src: string;
}

interface DocumentItem {
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "google-drive" | "onedrive";
  src: string;
}

interface ImageItem {
  title: string;
  description: string;
  type: "upload" | "link";
  src: string;
}

export default function StudyMaterialsPage() {
  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageDescription, setPageDescription] = useState<string>("");
  const [tab, setTab] = useState<number>(0);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [errors, setErrors] = useState({
    title: false,
    description: false,
  });

  const handleSave = async () => {
    const hasError = !pageTitle || !pageDescription || (!videos.length && !documents.length && !images.length);

    setErrors({
      title: !pageTitle,
      description: !pageDescription,
    });

    if (hasError) return;

    const payload = {
      pageTitle,
      pageDescription,
      videos,
      documents,
      images,
    };

    try {
      const res = await fetch("/study-materials-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
    } catch (e) {
      console.error("Erro ao salvar página", e);
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        width: { xs: "98%", md: "100%" },
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        sx={{
          width: "100%",
          fontSize: {
            xs: "1.6rem",
            sm: "2rem",
            md: "2.25rem",
          },
          textAlign: "center",
        }}
      >
        Criar Página de Materiais de Estudo
      </Typography>

      <Box
        sx={{
          width: { xs: "95%", md: "100%" },
          maxWidth: 800,
          mx: "auto",
          mb: 4,
        }}
      >
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

      <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
        <Tabs value={tab} onChange={(_, val) => setTab(val)} centered>
          <Tab label="Vídeos" />
          <Tab label="Doc" />
          <Tab label="Img" />
        </Tabs>
        <Divider sx={{ my: 3 }} />
      </Box>

      <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
        {tab === 0 && <StudyVideos videos={videos} setVideos={setVideos} />}
        {tab === 1 && <StudyDocuments documents={documents} setDocuments={setDocuments} />}
        {tab === 2 && <StudyImages images={images} setImages={setImages} />}
      </Box>

      <Box textAlign="center" mt={6} sx={{ width: "100%" }}>
        <Button variant="contained" size="large" onClick={handleSave}>
          Salvar Página
        </Button>
      </Box>
    </Box>
  );
}