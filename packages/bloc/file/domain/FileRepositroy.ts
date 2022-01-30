import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";

export interface FileRepository {
  downloadAllReportFiles(reportId: string): Promise<Either<DataError, Blob>>;
}
