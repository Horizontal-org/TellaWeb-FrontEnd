import { FileType } from "./FileType.enum";

export interface File {
  id: string;
  fileName: string;
  bucket: string;
  type: FileType;
  thumbnail?: string;
}
