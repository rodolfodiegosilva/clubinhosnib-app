import { Box, Typography } from "@mui/material";
import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";
import DownloadButton from "./DownloadButton";

interface Props {
  audio: StudyMediaItem;
}

export default function StudyAudioPlayerView({ audio }: Props) {
  const getDropboxRawUrl = (url: string): string => {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace(/\?dl=\d.*$/, "?raw=1");
  };

  const getFinalAudioUrl = (): string | null => {
    if (!audio.url) return null;

    if (audio.isLocalFile || audio.type === "upload") return audio.url;

    if (audio.platform === "dropbox") return getDropboxRawUrl(audio.url);

    return null; // Apenas dropbox e upload permitidos
  };

  const renderAudioPlayer = () => {
    const finalUrl = getFinalAudioUrl();

    if (!finalUrl) {
      return <Typography color="error">Áudio não disponível para reprodução.</Typography>;
    }

    return (
      <audio controls style={{ width: "100%" }}>
        <source src={finalUrl} />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    );
  };

  return (
    <Box sx={{ width: "98%", px: 1, py: 1 }}>
      {renderAudioPlayer()}

      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
        {audio.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {audio.description}
      </Typography>

      <DownloadButton
        url={audio.url}
        filename={audio.originalName || audio.title || "audio"}
      />
    </Box>
  );
}
