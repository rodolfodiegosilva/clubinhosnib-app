import { Typography, Box } from "@mui/material";
import { VideoItem } from "store/slices/video/videoSlice";

const VideoPlayer = ({ video }: { video: VideoItem }) => {
  if (video.type === "upload" && video.url) {
    return (
      <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
        <video controls style={{ width: "100%", display: "block" }}>
          <source src={video.url} />
          Seu navegador não suporta vídeo.
        </video>
      </Box>
    );
  }

  if (video.type === "link" && video.platform && video.url) {
    let embedUrl = "";
    if (video.platform === "youtube") {
      const videoId = video.url.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (video.platform === "googledrive") {
      const fileIdMatch = video.url.match(/\/d\/(.*?)(\/|$)/);
      const fileId = fileIdMatch?.[1];
      embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (video.platform === "onedrive") {
      embedUrl = video.url;
    }

    return embedUrl ? (
      <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
        <iframe
          src={embedUrl}
          title={video.title}
          allowFullScreen
          style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
        />
      </Box>
    ) : (
      <Typography variant="body1" color="error" sx={{ p: 2, textAlign: "center" }}>
        Plataforma não suportada ou URL inválida
      </Typography>
    );
  }

  return (
    <Typography variant="body1" color="error" sx={{ p: 2, textAlign: "center" }}>
      Formato de vídeo não suportado ou dados incompletos
    </Typography>
  );
};

export default VideoPlayer;