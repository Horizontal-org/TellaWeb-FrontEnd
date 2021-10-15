import { FileRepository } from "./FileRepositroy";
import { Either, DataError } from "../../common";

export class DownloadAllReportFilesUseCase {
  constructor(private fileRepository: FileRepository) {}

  execute(reportId: string): Promise<Either<DataError, Blob>> {
    return this.fileRepository.downloadAllReportFiles(reportId);
  }
}
