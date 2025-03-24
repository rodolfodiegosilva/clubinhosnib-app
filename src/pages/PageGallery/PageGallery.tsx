import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import FeedItem from "./SectionGallery";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setGalleryData } from "../../store/slices/gallery/gallerySlice";
import type { GalleryPageData } from "../../store/slices/gallery/gallerySlice";
import { RootState } from '../../store/slices';

interface PageGalleryProps {
  idToFetch?: string;
}

export default function PageGallery({ idToFetch }: PageGalleryProps) {
  const [galleryDataLocal, setFeedDataLocal] = useState<GalleryPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const feedMinisterioId = process.env.REACT_APP_FEED_MINISTERIO_ID;

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        const idToFetchPage = idToFetch ?? feedMinisterioId;
        const response = await api.get<GalleryPageData>(`/gallery/${idToFetchPage}`);
        setFeedDataLocal(response.data);
        dispatch(setGalleryData(response.data));
      } catch (err) {
        console.error("Erro ao buscar os dados do feed:", err);
        setError("Erro ao carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeedData();
  }, [idToFetch, feedMinisterioId, dispatch]);
  

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>Carregando...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: "95% !important", marginTop: "100px", p: 0 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {galleryDataLocal?.name || "Feed do Ministério"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {galleryDataLocal?.description || "Aqui você encontra fotos e notícias atuais do Ministério de Orfanato."}
        </Typography>

        {isAuthenticated && (
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/editar-feed-clubinho")}
          >
            Editar Feed
          </Button>
        )}
      </Box>

      <Box mt={4} display="flex" flexDirection="column" gap={4}>
        {galleryDataLocal?.sections.map((section) => (
          <FeedItem
            key={section.id}
            images={section.images}
            caption={section.caption}
            description={section.description}
            createdAt={galleryDataLocal.createdAt}
            updatedAt={galleryDataLocal.updatedAt}
          />
        ))}
      </Box>
    </Container>
  );
}
