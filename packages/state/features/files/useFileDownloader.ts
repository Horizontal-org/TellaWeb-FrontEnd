import { useBrowserDownload } from "./useBrowserDownload"
import { DownloaderState } from "./useFetchBlob"
import { File } from "../../domain/file"

type BaseFile = Pick<File, "fileName" | "id" | "bucket">

type FileDownloader = (file: BaseFile) => Promise<void>

export const useFileDownloader = (): [FileDownloader, DownloaderState] => {
  const [startDownload, downloadState] = useBrowserDownload()
  const download = async (file: BaseFile) => {
    const fileName = encodeURIComponent(file.fileName)
    return startDownload(
      `${process.env.NEXT_PUBLIC_API_URL}/file/download/${file.bucket}/${fileName}`
    )
  }

  return [download, downloadState]
}
