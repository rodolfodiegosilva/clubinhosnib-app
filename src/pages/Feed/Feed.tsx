import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import FeedItem from "./FeedItem";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFeedData } from "../../store/slices/feed/feedSlice";
import type { GalleryPageData } from "../../store/slices/feed/feedSlice";
import { RootState } from '../../store/slices';

export default function Feed() {
  const [feedDataLocal, setFeedDataLocal] = useState<GalleryPageData | null>(null);
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
        const response = await api.get<GalleryPageData>(`/gallery/${feedMinisterioId}`);
        setFeedDataLocal(response.data);
        dispatch(setFeedData(response.data));
      } catch (err) {
        console.error("Erro ao buscar os dados do feed:", err);
        setError("Erro ao carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [feedMinisterioId, dispatch]);

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
          {feedDataLocal?.name || "Feed do Ministério"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {feedDataLocal?.description || "Aqui você encontra fotos e notícias atuais do Ministério de Orfanato."}
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
        {feedDataLocal?.sections.map((section) => (
          <FeedItem
            key={section.id}
            images={section.images}
            caption={section.caption}
            description={section.description}
            createdAt={feedDataLocal.createdAt}
            updatedAt={feedDataLocal.updatedAt}
          />
        ))}
      </Box>
    </Container>
  );
}
