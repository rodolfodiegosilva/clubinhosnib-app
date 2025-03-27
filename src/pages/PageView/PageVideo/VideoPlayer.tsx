import { Typography } from "@mui/material";
import { VideoItem } from "store/slices/video/videoSlice";

const VideoPlayer = ({ video }: { video: VideoItem }) => {
  if (video.type === "upload") {
    return (
      <video controls style={{ width: "100%", borderRadius: 12 }}>
        <source src={video.url} />
        Seu navegador não suporta vídeo.
      </video>
    );
  }

  if (video.type === "link" && video.platform) {
    let embedUrl = "";
    if (video.platform === "youtube") {
      const videoId = video.url.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (video.platform === "google-drive") {
      const fileIdMatch = video.url.match(/\/d\/(.*?)(\/|$)/);
      const fileId = fileIdMatch?.[1];
      embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (video.platform === "onedrive") {
      embedUrl = video.url;
    }

    return embedUrl ? (
      <iframe
        src={embedUrl}
        title={video.title}
        allowFullScreen
        style={{ width: "100%", aspectRatio: "16/9", border: 0, borderRadius: 12 }}
      />
    ) : (
      <Typography variant="body2">Plataforma não suportada</Typography>
    );
  }

  return <Typography variant="body2">Formato de vídeo não suportado</Typography>;
};

export default VideoPlayer;
