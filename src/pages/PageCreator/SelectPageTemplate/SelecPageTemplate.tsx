import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearFeedData } from "../../../store/slices/feed/feedSlice";

import "./SelecPageTemplate.css";

import Videos from "../Videos";
import Informative from "../Informative";
import StudyMaterials from "../StudyMaterials";
import Events from "../Events";
import Gallery from "../Templates/PhotosGallery/Gallery";
import { JSX } from "react/jsx-runtime";

enum Options {
  GALLERY = "Galeria de Fotos",
  VIDEOS = "Galeria de Videos",
  INFORMATIVE = "Pagina Iformativa",
  STUDY_MATERIALS = "Pagina de Materiais de Estudo",
  EVENTS = "Pagina de Eventos",
}

const componentMap: Record<Options, JSX.Element> = {
  [Options.GALLERY]: <Gallery fromTemplatePage={true} />,
  [Options.VIDEOS]: <Videos />,
  [Options.INFORMATIVE]: <Informative />,
  [Options.STUDY_MATERIALS]: <StudyMaterials />,
  [Options.EVENTS]: <Events />,
};

export default function SelecPageTemplate() {
  const [selectedOption, setSelectedOption] = useState<Options | "">("");
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Options;
    setSelectedOption(selected);

    // Limpa Redux ao escolher galeria
    if (selected === Options.GALLERY) {
      dispatch(clearFeedData());
    }
  };

  return (
    <div className="dynamic-page">
      <h2 className="dynamic-title">Escolha um Modelo</h2>
      <p className="dynamic-subtitle">
        Selecione um modelo abaixo para visualizar e criar um novo conteúdo.
      </p>

      <div className="select-container">
        <select className="custom-select" onChange={handleChange} value={selectedOption}>
          <option value="">Selecione uma página</option>
          {Object.values(Options).map((option) => (
            <option key={option} value={option}>
              {option.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className={`component-container ${selectedOption ? "active" : ""}`}>
        {selectedOption ? (
          componentMap[selectedOption]
        ) : (
          <p className="placeholder">Selecione um template para visualizar.</p>
        )}
      </div>
    </div>
  );
}
