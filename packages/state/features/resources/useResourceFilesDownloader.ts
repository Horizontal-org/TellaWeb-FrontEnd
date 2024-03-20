import { useFetchBlob, DownloaderState } from "../files/useFetchBlob";

type ResourceFileDownloader = (fileNames: string[]) => Promise<void>;

export const useResourceFileDownloader = (): [
  ResourceFileDownloader,
  DownloaderState
] => {
  const [downloadBlob, downloadState] = useFetchBlob();

  const download = async (fileNames: string[]) => {
    const query = fileNames.map(f => `fileNames[]=${f}&`).join("")
    const url = `${process.env.NEXT_PUBLIC_API_URL}/resource/download?${query}`;
    console.log("🚀 ~ file: useResourceFilesDownloader.ts:14 ~ download ~ query:", query)
    return downloadBlob(url);
  };

  return [download, downloadState];
};
