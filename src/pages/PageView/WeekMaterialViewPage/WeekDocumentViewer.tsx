import { useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadButton from "./DownloadButton";
import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";
import WeekDocumentModal from "./WeekDocumentModal";

interface Props {
  document: WeekMediaItem;
}

export default function WeekDocumentViewer({ document }: Props) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const getGoogleDrivePreviewUrl = (url: string): string | null => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  const getPreviewUrl = (): string | null => {
    if (!document.url) return null;
    if (document.isLocalFile || document.type === "upload") return document.url;
    if (document.platform === "googledrive") return getGoogleDrivePreviewUrl(document.url);
    return null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="subtitle1" fontWeight="bold" color={theme.palette.success.main}>
          {document.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {document.description}
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {previewUrl && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Visualizar
            </Button>
          )}
          <DownloadButton
            url={document.url}
            filename={document.originalName || document.title || "documento"}
          />
        </Box>
        {previewUrl && (
          <WeekDocumentModal
            open={open}
            onClose={() => setOpen(false)}
            document={{ ...document, url: previewUrl }}
          />
        )}
      </motion.div>
    </Box>
  );
}