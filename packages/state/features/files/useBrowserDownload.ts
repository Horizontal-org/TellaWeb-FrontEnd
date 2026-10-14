import { useState } from "react"
import { useDispatch } from "react-redux"

import { userApi } from "../../services/user"
import { DownloaderState } from "./useFetchBlob"

type BrowserDownloader = (url: string) => Promise<void>

// Hands the download to the browser: it streams to disk with its own progress
// and resume, instead of the whole file being held in the tab's memory.
// The browser authenticates with the access_token cookie, not a Bearer header.
export const useBrowserDownload = (): [BrowserDownloader, DownloaderState] => {
  const dispatch = useDispatch<any>()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isError, setIsError] = useState(false)

  const download = async (url: string) => {
    setIsError(false)
    setIsDownloading(true)
    try {
      // any authenticated call refreshes an expired session, which also
      // renews the cookie the download will be sent with
      await dispatch(
        userApi.endpoints.getProfile.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
        })
      ).unwrap()
    } catch (error) {
      setIsError(true)
      return
    } finally {
      setIsDownloading(false)
    }

    // same origin + download attribute: the file name comes from the
    // response's Content-Disposition, the page stays where it is, and an
    // error shows as a failed download instead of replacing the page
    const link = document.createElement("a")
    link.href = url
    link.download = ""
    link.click()
  }

  return [download, { isDownloading, isError }]
}
