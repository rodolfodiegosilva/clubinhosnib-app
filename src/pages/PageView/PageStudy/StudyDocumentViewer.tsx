import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";
import StudyDocumentModal from "./StudyDocumentModal";

interface Props {
  document: StudyMediaItem;
}

export default function StudyDocumentViewer({ document }: Props) {
  const [open, setOpen] = useState(false);

  const getGoogleDrivePreviewUrl = (url: string): string | null => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  const getPreviewUrl = (): string | null => {
    if (!document.url) return null;
    if (document.isLocalFile || document.type === "upload") return document.url;
    if (document.platform === "google-drive") return getGoogleDrivePreviewUrl(document.url);
    return null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <Box sx={{ width: "98%", px: 1, py: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {document.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {document.description}
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" gap={1} mt={2}>
        {previewUrl && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setOpen(true)}
          >
            Visualizar
          </Button>
        )}

        <a
          href={document.url}
          download={document.originalName || document.title}
          target="_blank"
          rel="noreferrer"
          style={{ width: "100%" }}
        >
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
          >
            Baixar
          </Button>
        </a>
      </Box>

      {previewUrl && (
        <StudyDocumentModal
          open={open}
          onClose={() => setOpen(false)}
          document={{ ...document, url: previewUrl }}
        />
      )}
    </Box>
  );
}
