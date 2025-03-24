// components/PageRenderer.tsx
import React from "react";
import PageGallery from "../../pages/PageGallery/PageGallery";
// import Blog from "../pages/Blog/Blog";
// import Video from "../pages/Video/Video";

interface PageRendererProps {
  entityType: string;
  idToFetch: string;
}

const PageRenderer: React.FC<PageRendererProps> = ({ entityType, idToFetch }) => {
  switch (entityType) {
    case "GalleryPage":
      return <PageGallery idToFetch={idToFetch} />;
    // case "BlogPage":
    //   return <Blog entityId={entityId} />;
    // case "VideoPage":
    //   return <Video entityId={entityId} />;
    default:
      return <div>Tipo de página desconhecido: {entityType}</div>;
  }
};

export default PageRenderer;
