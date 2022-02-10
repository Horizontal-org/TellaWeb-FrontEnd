import { useState } from "react";
import { useSelector } from "react-redux";

import { RootStore } from "../../store";

type Downloader = (url: string, fileType?: string) => Promise<void>;

export interface DownloaderState {
  isDownloading: boolean;
  isError: boolean;
}

export const useFetchBlob = (): [Downloader, DownloaderState] => {
  const accessToken = useSelector((state: RootStore) => state.auth.accessToken);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isError, setIsError] = useState(false);

  const resetState = () => {
    setIsDownloading(false);
    setIsError(false);
  };

  const download = async (url: string, fileType?: string) => {
    resetState();

    try {
      setIsDownloading(true);

      const response = await fetch(url, {
        headers: new Headers({
          authorization: `Bearer ${accessToken}`,
        }),
      });

      const blob = await response.blob();
      openBlob(blob, fileType);

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      setIsError(true);
    }
  };

  const openBlob = (blob: Blob, type?: string) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = type ? `download.${type}` : `download`;
    link.target = "_blank";
    link.click();
  };

  return [download, { isDownloading, isError }];
};
