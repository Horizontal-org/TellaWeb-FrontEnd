import { useFetchBlob, DownloaderState } from "../files/useFetchBlob";
import { File } from "../../domain/file";


type FileDownloader = (id: string, name: string) => Promise<void>;

export const useBackupDownloader = (): [FileDownloader, DownloaderState] => {
  const [downloadBlob, downloadState] = useFetchBlob();
  const download = async (id: string, name: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/backup/download/${id}`;
    
    return downloadBlob(url, 'zip', name);
  };

  return [download, downloadState];
};
