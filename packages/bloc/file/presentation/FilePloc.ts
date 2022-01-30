import { DataError, Ploc, UnexpectedError } from "../../common";
import { DownloadAllReportFilesUseCase } from "../domain/DownloadAllReportFilesUseCase";
import { fileInitialState, FileState } from "./FileState";

export class FilePloc extends Ploc<FileState> {
  constructor(private downloadAllReportFiles: DownloadAllReportFilesUseCase) {
    super(fileInitialState);
  }

  async donwloadReportFiles(reportId: string) {
    const downloadResult = await this.downloadAllReportFiles.execute(reportId);

    downloadResult.fold(
      (error) =>
        this.changeState(this.handleError(new UnexpectedError(error.message))),
      (file) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(file);
        link.download = "download";
        link.target = "_blank";
        link.click();
      }
    );
  }

  private handleError(error: DataError): FileState {
    switch (error.kind) {
      case "UnexpectedError": {
        return {
          ...this.state,
          kind: "ErrorFileState",
          error: "Sorry, an error has ocurred. Please try later again",
        };
      }
    }
  }
}
