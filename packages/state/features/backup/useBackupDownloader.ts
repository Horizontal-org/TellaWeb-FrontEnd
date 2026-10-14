import { useBrowserDownload } from "../files/useBrowserDownload"
import { DownloaderState } from "../files/useFetchBlob"

type BackupDownloader = (id: string) => Promise<void>

export const useBackupDownloader = (): [BackupDownloader, DownloaderState] => {
  const [startDownload, downloadState] = useBrowserDownload()
  const download = async (id: string) =>
    startDownload(`${process.env.NEXT_PUBLIC_API_URL}/backup/download/${id}`)

  return [download, downloadState]
}
