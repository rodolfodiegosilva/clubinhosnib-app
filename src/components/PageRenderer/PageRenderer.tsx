
import PageGalleryView from "pages/PageView/PageGallery/PageGalleryView";
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
    // case "VideoPage":
    //   return <Video entityId={entityId} />;
    default:
      return <div>Tipo de página desconhecido: {entityType}</div>;
  }
};

export default PageRenderer;
