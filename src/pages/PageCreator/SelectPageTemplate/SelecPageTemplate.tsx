import { useState } from "react";
import "./SelecPageTemplate.css";
import Videos from "../Videos";
import Informative from "../Informative";
import StudyMaterials from "../StudyMaterials";
import Events from "../Events";
import { JSX } from "react/jsx-runtime";
import Gallery from "../Templates/PhotosGallery/Gallery";

enum Options {
  GALLERY = "Galeria de Fotos",
  VIDEOS = "Galeria de Videos",
  INFORMATIVE = "Pagina Iformativa",
  STUDY_MATERIALS = "Pagina de Materiais de Estudo",
  EVENTS = "Pagina de Eventos",
}

const componentMap: Record<Options, JSX.Element> = {
  [Options.GALLERY]: <Gallery />,
  [Options.VIDEOS]: <Videos />,
  [Options.INFORMATIVE]: <Informative />,
  [Options.STUDY_MATERIALS]: <StudyMaterials />,
  [Options.EVENTS]: <Events />,
};

export default function SelecPageTemplate() {
  const [selectedOption, setSelectedOption] = useState<Options | "">("");

  return (
    <div className="dynamic-page">
      <h2 className="dynamic-title">Escolha um Modelo</h2>
      <p className="dynamic-subtitle">
        Selecione um modelo abaixo para visualizar e criar um novo conteúdo.
      </p>

      <div className="select-container">
        <select
          className="custom-select"
          onChange={(e) => setSelectedOption(e.target.value as Options)}
        >
          <option value="">Selecione uma página</option>
          {Object.values(Options).map((option) => (
            <option key={option} value={option}>
              {option.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className={`component-container ${selectedOption ? "active" : ""}`}>
        {selectedOption ? componentMap[selectedOption] : (
          <p className="placeholder">Selecione um template para visualizar.</p>
        )}
      </div>
    </div>
  );
}
