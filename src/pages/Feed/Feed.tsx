import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import FeedItem from "./FeedItem";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from "@mui/material";

export interface FeedImageData {
  id: string;
  url: string;
  isLocalFile: boolean;
}

interface SectionData {
  id: string;
  caption: string;
  description: string;
  images: FeedImageData[];
}

interface FeedData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sections: SectionData[];
}

export default function Feed() {
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const feedMinisterioId = process.env.REACT_APP_FEED_MINISTERIO_ID;

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        const response = await api.get<FeedData>(`/gallery/${feedMinisterioId}`);
        setFeedData(response.data);
      } catch (err) {
        console.error("Erro ao buscar os dados do feed:", err);
        setError("Erro ao carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [feedMinisterioId]);

  if (loading)
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>Carregando...</Typography>
        </Box>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        {feedData?.name || "Feed do Ministério"}
      </Typography>

      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        {feedData?.description || "Aqui você encontra fotos e notícias atuais do Ministério de Orfanato."}
      </Typography>

      <Box mt={4} display="flex" flexDirection="column" gap={4}>
        {feedData?.sections.map((section) => (
          <FeedItem
            key={section.id}
            images={section.images}
            caption={section.caption}
            description={section.description}
            createdAt={feedData.createdAt}
            updatedAt={feedData.updatedAt}
          />
        ))}
      </Box>
    </Container>
  );
}
