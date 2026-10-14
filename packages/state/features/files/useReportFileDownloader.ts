import { useBrowserDownload } from "./useBrowserDownload"
import { DownloaderState } from "./useFetchBlob"

type ReportFileDownloader = (reportId: string) => Promise<void>

export const useReportFileDownloader = (): [
  ReportFileDownloader,
  DownloaderState
] => {
  const [startDownload, downloadState] = useBrowserDownload()

  const download = async (reportId: string) =>
    startDownload(`${process.env.NEXT_PUBLIC_API_URL}/file/report/${reportId}`)

  return [download, downloadState]
}
