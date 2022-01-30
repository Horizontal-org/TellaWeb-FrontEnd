import { useState } from "react";
import { useSelector } from "react-redux";

import { File } from "../../domain/file";
import { RootStore } from "../../store";

type BaseFile = Pick<File, "fileName" | "id" | "bucket">;

type Downloader = (file: BaseFile) => Promise<void>;

interface DownloaderState {
  isDownloading: boolean;
  isError: boolean;
}

export const useFileDownloader = (): [Downloader, DownloaderState] => {
  const accessToken = useSelector((state: RootStore) => state.auth.accessToken);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isError, setIsError] = useState(false);

  const resetState = () => {
    setIsDownloading(false);
    setIsError(false);
  };

  const download = async (file: {
    id: string;
    bucket: string;
    fileName: string;
  }) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/file/${file.bucket}/${file.id}`;
    const fileType = file.fileName.split(".")[1];

    resetState();

    try {
      setIsDownloading(true);

      const response = await fetch(baseUrl, {
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

  const openBlob = (blob: Blob, type: string) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `download.${type}`;
    link.target = "_blank";
    link.click();
  };

  return [download, { isDownloading, isError }];
};
