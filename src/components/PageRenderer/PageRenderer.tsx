
import PageGalleryView from "pages/PageView/PagePhoto/PageGalleryView";
import StudyMaterialsPageView from "pages/PageView/PageStudy/StudyMaterialsPageView";
import PageVideoView from "pages/PageView/PageVideo/PageVideoView";
import React from "react";

interface PageRendererProps {
  entityType: string;
  idToFetch: string;
}

const PageRenderer: React.FC<PageRendererProps> = ({ entityType, idToFetch }) => {
  switch (entityType) {
    case "GalleryPage":
      return <PageGalleryView idToFetch={idToFetch} />;
    case "VideosPage":
      return <PageVideoView idToFetch={idToFetch} />;
     case "StudyMaterialsPage":
       return <StudyMaterialsPageView idToFetch={idToFetch}/>;
    default:
      return <div>Tipo de página desconhecido: {entityType}</div>;
  }
};

export default PageRenderer;
