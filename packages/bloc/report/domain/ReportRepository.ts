import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { Pagination } from "../../common/domain/Pagination";
import { Report } from "./Report";

export interface ReportRepository {
  list(): Promise<Either<DataError, Pagination<Report>>>;
  getById(reportId: string): Promise<Either<DataError, Report>>;
  downloadReport(reportId: string): Promise<Either<DataError, Blob>>;
  delete(reportId: string): Promise<Either<DataError, boolean>>;
}
