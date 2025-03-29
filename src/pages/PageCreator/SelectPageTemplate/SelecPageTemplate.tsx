import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearGalleryData } from "../../../store/slices/gallery/gallerySlice";

import {
  Box,
  Typography,
  Select,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { ReactElement } from "react";
import StudyMaterialPageCreator from "../Templates/StudyMaterialPageCreator/StudyMaterialPageCreator";
import VideoPageCreator from "../Templates/VideoPageCreator/VideoPageCreator";
import PhotoPageCreator from "../Templates/PhotoPageCreator/PhotoPageCreator";
import InforamtivePageCreator from "../Templates/InforamtivePageCreator/InforamtivePageCreator";
import EventPageCreator from "../Templates/EventPageCreator/EventPageCreator";



// Enum com rótulos descritivos
enum Options {
  GALLERY = "Galeria de Fotos",
  VIDEOS = "Galeria de Videos",
  INFORMATIVE = "Pagina Informativa",
  STUDY_MATERIALS = "Pagina de Materiais de Estudo",
  EVENTS = "Pagina de Eventos",
}

// Mapeamento de componentes como funções
const componentMap: Record<keyof typeof Options, () => ReactElement> = {
  GALLERY: () => <PhotoPageCreator fromTemplatePage={true} />,
  VIDEOS: () => <VideoPageCreator fromTemplatePage={true}/>,
  INFORMATIVE: () => <InforamtivePageCreator />,
  STUDY_MATERIALS: () => <StudyMaterialPageCreator />,
  EVENTS: () => <EventPageCreator />,
};

export default function SelecPageTemplate() {
  const [selectedOption, setSelectedOption] = useState<keyof typeof Options | "">("");
  const dispatch = useDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    const selected = event.target.value as keyof typeof Options;
    setSelectedOption(selected);

    if (selected === "GALLERY") {
      dispatch(clearGalleryData());
    }
  };

  return (
<Box
  sx={{
    minHeight: "100vh",
    py: 6,
    px: 2,
    mt: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bgcolor: "linear-gradient(to bottom, #f4f4f4, #e8e8e8)",
    textAlign: "center",
  }}
>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Escolha um Modelo
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Selecione um modelo abaixo para visualizar e criar um novo conteúdo.
      </Typography>

      <FormControl sx={{ minWidth: 300, mb: 4 }} fullWidth>
        <InputLabel id="template-select-label">Selecione uma página</InputLabel>
        <Select
          labelId="template-select-label"
          value={selectedOption}
          onChange={handleChange}
          label="Selecione uma página"
        >
          <MenuItem value="">
            <em>Nenhuma</em>
          </MenuItem>
          {Object.entries(Options).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper
        elevation={3}
        sx={{
          width: "95%",
          maxWidth: "95%",
          p: 1,
          mt: 2,
          transition: "all 0.3s ease-in-out",
          opacity: selectedOption ? 1 : 0.5,
        }}
      >

        {selectedOption ? (
          componentMap[selectedOption as keyof typeof Options]()
        ) : (
          <Typography variant="body1" color="text.secondary">
            Selecione um template para visualizar.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
