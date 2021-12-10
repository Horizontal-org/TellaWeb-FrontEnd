import { DataError, Ploc, UnexpectedError } from "../../common";
import { BasicFileDto, File } from "../domain";
import { DeleteFileUseCase } from "../domain/DeleteFileUseCase";
import { DownloadAllReportFilesUseCase } from "../domain/DownloadAllReportFilesUseCase";
import { DownloadFileUseCase } from "../domain/DownloadFileUseCase";
import { fileInitialState, FileState } from "./FileState";

export class FilePloc extends Ploc<FileState> {
  constructor(
    private downloadAllReportFiles: DownloadAllReportFilesUseCase,
    private downloadFile: DownloadFileUseCase,
    private deleteFile: DeleteFileUseCase
  ) {
    super(fileInitialState);
  }

  async donwload(file: BasicFileDto) {
    const downloadResult = await this.downloadFile.execute(file);
    const type = file.fileName.split('.')[1] 

    downloadResult.fold(
      (error) =>
        this.changeState(this.handleError(new UnexpectedError(error.message))),
      (file) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(file);
        link.download = `download.${type}`;
        link.target = "_blank";
        link.click();
      }
    );
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

  async delete(file: BasicFileDto) {
    const openResult = await this.deleteFile.execute(file);
    openResult.fold(
      (error) => this.changeState(this.handleError(error)),
      (deleted) => {
        this.changeState({ kind: "DeletedFileState", fileName: file.fileName });
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
