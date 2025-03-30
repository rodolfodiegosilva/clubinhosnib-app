import { Box, Typography, Link } from "@mui/material";
import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";
import DownloadButton from "./DownloadButton";

interface Props {
  video: StudyMediaItem;
}

export default function StudyVideoPlayer({ video }: Props) {
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (url.includes("youtube.com")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  };

  const getGoogleDriveEmbedUrl = (url: string): string | null => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  const getDropboxRawUrl = (url: string): string => {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.replace("www.dropbox.com", "dl.dropboxusercontent.com") + "?raw=1";
  };

  const shouldRenderVideo = (): boolean => {
    if (video.isLocalFile || video.type === "upload") return true;
    if (video.type === "link" && (video.platform === "youtube" || video.platform === "google-drive")) return true;
    return false;
  };

  const shouldAllowDownload = (): boolean => {
    return (
      video.isLocalFile ||
      video.type === "upload" ||
      video.platform === "google-drive" ||
      video.platform === "dropbox" ||
      video.platform === "onedrive"
    );
  };

  const renderVideo = () => {
    if (!video.url) return <Typography>Vídeo não disponível.</Typography>;

    if (!shouldRenderVideo()) return <Typography>Esse vídeo não pode ser renderizado na página.</Typography>;

    if (video.isLocalFile || video.type === "upload") {
      return (
        <video controls style={{ width: "100%", borderRadius: 12 }}>
          <source src={video.url} />
          Seu navegador não suporta vídeo embutido.
        </video>
      );
    }

    if (video.type === "link") {
      switch (video.platform) {
        case "youtube": {
          const embedUrl = getYouTubeEmbedUrl(video.url);
          return embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allowFullScreen
              style={{ width: "100%", aspectRatio: "16/9", border: "none", borderRadius: 12 }}
            />
          ) : (
            <Typography>URL do YouTube inválida.</Typography>
          );
        }

        case "google-drive": {
          const embedUrl = getGoogleDriveEmbedUrl(video.url);
          return embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allowFullScreen
              style={{ width: "100%", aspectRatio: "16/9", border: "none", borderRadius: 12 }}
            />
          ) : (
            <Typography>URL do Google Drive inválida.</Typography>
          );
        }

        default:
          return <Typography>Plataforma de vídeo não suportada para visualização.</Typography>;
      }
    }

    return <Typography>Tipo de vídeo não suportado.</Typography>;
  };

  return (
    <Box sx={{ width: "98%", px: 1, py: 1 }}>
      {renderVideo()}
      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
        {video.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {video.description}
      </Typography>

      {shouldAllowDownload() && (
        <DownloadButton
          url={
            video.platform === "dropbox"
              ? getDropboxRawUrl(video.url)
              : video.url
          }
          filename={video.originalName || video.title || "video"}
        />
      )}
    </Box>
  );
}
