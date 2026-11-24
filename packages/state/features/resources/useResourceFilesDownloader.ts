import { useBrowserDownload } from "../files/useBrowserDownload"
import { DownloaderState } from "../files/useFetchBlob"

type ResourceFileDownloader = (fileNames: string[]) => Promise<void>

export const useResourceFileDownloader = (): [
  ResourceFileDownloader,
  DownloaderState
] => {
  const [startDownload, downloadState] = useBrowserDownload()

  const download = async (fileNames: string[]) => {
    // the API reads a repeated fileNames key, not fileNames[]
    const query = new URLSearchParams(fileNames.map((f) => ["fileNames", f]))
    return startDownload(
      `${process.env.NEXT_PUBLIC_API_URL}/resource/download?${query}`
    )
  }

  return [download, downloadState]
}
