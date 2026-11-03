import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { userApi } from "../../services/user"
import { RootStore } from "../../store"
import { DownloaderState } from "./useFetchBlob"

type BrowserDownloader = (url: string) => Promise<void>

// a small margin so the token can't expire between this check and the request
const EXPIRY_MARGIN_MS = 30_000

const isTokenFresh = (token?: string) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(payload)).exp * 1000 - EXPIRY_MARGIN_MS > Date.now()
  } catch {
    return false
  }
}

// Hands the download to the browser: it streams to disk with its own progress
// and resume, instead of the whole file being held in the tab's memory.
// The browser authenticates with the access_token cookie, not a Bearer header.
export const useBrowserDownload = (): [BrowserDownloader, DownloaderState] => {
  const dispatch = useDispatch<any>()
  const accessToken = useSelector((state: RootStore) => state.auth.accessToken)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isError, setIsError] = useState(false)

  const download = async (url: string) => {
    setIsError(false)
    if (!isTokenFresh(accessToken)) {
      if (!(await refreshSession())) return
    }

    // same origin + download attribute: the file name comes from the
    // response's Content-Disposition, the page stays where it is, and an
    // error shows as a failed download instead of replacing the page
    const link = document.createElement("a")
    link.href = url
    link.download = ""
    link.click()
  }

  const refreshSession = async () => {
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
      return true
    } catch (error) {
      setIsError(true)
      return false
    } finally {
      setIsDownloading(false)
    }
  }

  return [download, { isDownloading, isError }]
}
