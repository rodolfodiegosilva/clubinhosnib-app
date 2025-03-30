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
export function buildFileItem<T extends FileItem>(
  item: T,
  index: number,
  prefix: string,
  formData: FormData
): T & { fileField?: string } {
  if (item.type === "upload" && item.file instanceof File) {
    const extension = item.file.name.split(".").pop() || "bin";
    const filename = `${prefix}_${index}.${extension}`;
    formData.append(filename, item.file, filename);

    return {
      ...item,
      url: undefined, // removemos a prévia usada no front
      fileField: filename,
    };
  }

  return {
    ...item,
    fileField: undefined,
  };
}
