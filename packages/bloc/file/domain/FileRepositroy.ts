import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { BasicFileDto } from "./BasicFileDto";

export interface FileRepository {
  downloadAllReportFiles(reportId: string): Promise<Either<DataError, Blob>>;
  download(fileDto: BasicFileDto): Promise<Either<DataError, Blob>>;
  delete(fileDto: BasicFileDto): Promise<Either<DataError, boolean>>;
}
