
import PageGalleryView from "pages/PageView/ImagePageView/ImagePageView";
import PageVideoView from "pages/PageView/VideoViewPage/PageVideoView";
import WeekMaterialsPageView from "pages/PageView/WeekMaterialViewPage/WeekMaterialsPageView";
import React from "react";

interface PageRendererProps {
  entityType: string;
  idToFetch: string;
}

const PageRenderer: React.FC<PageRendererProps> = ({ entityType, idToFetch }) => {
  switch (entityType) {
    case "ImagePageEntity":
      return <PageGalleryView idToFetch={idToFetch} />;
    case "VideosPage":
      return <PageVideoView idToFetch={idToFetch} />;
     case "WeekMaterialsPage":
       return <WeekMaterialsPageView idToFetch={idToFetch}/>;
    default:
      return <div>Tipo de página desconhecido: {entityType}</div>;
  }
};

export default PageRenderer;
