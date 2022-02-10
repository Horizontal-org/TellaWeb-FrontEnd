import { useFetchBlob, DownloaderState } from "./useFetchBlob";

type ReportFileDownloader = (reportId: string) => Promise<void>;

export const useReportFileDownloader = (): [
  ReportFileDownloader,
  DownloaderState
] => {
  const [downloadBlob, downloadState] = useFetchBlob();

  const download = async (reportId) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/file/report/${reportId}`;
    return downloadBlob(url);
  };

  return [download, downloadState];
};
