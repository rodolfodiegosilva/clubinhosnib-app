import { VideoItem } from "store/slices/video/videoSlice";

export interface FileItem {
  type: "upload" | "link";
  url?: string;
  file?: File;
  [key: string]: any;
}

/**
 * Adiciona um arquivo de upload ao FormData e retorna o item com `fileField` para referência no JSON.
 * Suporta múltiplos tipos: vídeo, imagem, documento e áudio.
 */
export const buildFileItem = (
  item: VideoItem,
  index: number,
  prefix: string,
  formData: FormData
) => {
  const fileField = `${prefix}-${index}`;
  if (item.type === "upload" && item.isLocalFile && item.file) {
    formData.append(fileField, item.file);
  }
  return {
    ...item,
    fileField: item.type === "upload" && item.isLocalFile ? fileField : undefined,
  };
};
