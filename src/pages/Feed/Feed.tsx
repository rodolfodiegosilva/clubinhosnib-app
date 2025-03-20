import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import FeedItem from "./FeedItem";
import "./Feed.css";

interface ImageData {
  id: string;
  url: string;
  isLocalFile: boolean;
}

interface SectionData {
  id: string;
  caption: string;
  description: string;
  images: ImageData[];
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
      <div className="feed-loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );

  if (error) return <p className="feed-error-message">{error}</p>;

  return (
    <div className="feed-page">
      <h2 className="feed-title">{feedData?.name || "Feed do Ministério"}</h2>
      <p className="feed-subtitle">{feedData?.description || "Aqui você encontra fotos e notícias atuais do Ministério de Orfanato."}</p>

      <div className="feed-container">
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
      </div>
    </div>
  );
}
