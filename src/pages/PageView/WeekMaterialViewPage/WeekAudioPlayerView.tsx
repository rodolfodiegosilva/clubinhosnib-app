import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import DownloadButton from "./DownloadButton";
import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";

interface Props {
  audio: WeekMediaItem;
}

export default function WeekAudioPlayerView({ audio }: Props) {
  const theme = useTheme();

  const getDropboxRawUrl = (url: string): string => {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace(/\?dl=\d.*$/, "?raw=1");
  };

  const getFinalAudioUrl = (): string | null => {
    if (!audio.url) return null;
    if (audio.isLocalFile || audio.type === "upload") return audio.url;
    if (audio.platform === "dropbox") return getDropboxRawUrl(audio.url);
    return null;
  };

  const renderAudioPlayer = () => {
    const finalUrl = getFinalAudioUrl();
    if (!finalUrl) {
      return <Typography color="error">Áudio não disponível para reprodução.</Typography>;
    }
    return (
      <audio controls style={{ width: "100%", borderRadius: 8 }}>
        <source src={finalUrl} />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    );
  };

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderAudioPlayer()}
        <Typography variant="subtitle1" fontWeight="bold" mt={1} color={theme.palette.secondary.main}>
          {audio.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {audio.description}
        </Typography>
        <DownloadButton
          url={audio.url}
          filename={audio.originalName || audio.title || "audio"}
        />
      </motion.div>
    </Box>
  );
}