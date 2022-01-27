export enum FileType {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  OTHER = "OTHER",
}

export interface File {
  id: string;
  fileName: string;
  bucket: string;
  type: FileType;
  thumbnail?: string;
}
