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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/file/${file.bucket}/${file.id}`;
    const fileType = file.fileName.split(".")[1];
    return downloadBlob(url, fileType);
  };

  return [download, downloadState];
};
