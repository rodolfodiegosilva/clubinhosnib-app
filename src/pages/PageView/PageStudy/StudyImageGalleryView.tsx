import { Box, Typography } from "@mui/material";
import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";
import DownloadButton from "./DownloadButton";

interface Props {
  image: StudyMediaItem;
}

const getGoogleDriveThumbnailUrl = (url: string): string | null => {
  const match = url.match(/\/d\/(.*?)\//);
  return match ? `https://drive.google.com/thumbnail?id=${match[1]}` : null;
};

export default function StudyImageGallery({ image }: Props) {
  const canVisualize = image.isLocalFile || image.type === "upload" || image.platform === "google-drive";

  const getImageUrl = () => {
    if (image.isLocalFile || image.type === "upload") {
      return image.url;
    }
    if (image.platform === "google-drive") {
      return getGoogleDriveThumbnailUrl(image.url);
    }
    return null;
  };

  const finalUrl = getImageUrl();

  return (
    <Box sx={{ width: "98%", px: 1, py: 1 }}>
      {canVisualize && finalUrl ? (
        <img
          src={finalUrl}
          alt={image.title || "Imagem"}
          style={{
            width: "100%",
            borderRadius: 8,
            maxHeight: 300,
            objectFit: "cover",
            marginBottom: 8,
          }}
        />
      ) : (
        <Typography color="error" mb={2}>
          Visualização não disponível para esta imagem.
        </Typography>
      )}

      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
        {image.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {image.description}
      </Typography>

      <DownloadButton
        url={image.url}
        filename={image.originalName || image.title || "imagem"}
      />
    </Box>
  );
}
