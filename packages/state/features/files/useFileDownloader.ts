import { useFetchBlob, DownloaderState } from "./useFetchBlob";
import { File } from "../../domain/file";

type BaseFile = Pick<File, "fileName" | "id" | "bucket">;

type FileDownloader = (file: BaseFile) => Promise<void>;

export const useFileDownloader = (): [FileDownloader, DownloaderState] => {
  const [downloadBlob, downloadState] = useFetchBlob();
  const download = async (file: {
    id: string;
    bucket: string;
    fileName: string;
  }) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/file/download/${file.bucket}/${file.fileName}`;
    const fileNameParts = file.fileName.split('.');
    const fileType = fileNameParts[fileNameParts.length - 1].toUpperCase();
    return downloadBlob(url, fileType);
  };

  return [download, downloadState];
};
