import { ApiDataFetcher, DataError, Either, Pagination } from "../../common";
import { Report, ReportRepository } from "../domain";

export class RemoteReportRepository implements ReportRepository {
  private url = "/report";

  constructor(private api: ApiDataFetcher) {}

  async getById(reportId: string): Promise<Either<DataError, Report>> {
    return this.api.get<Report>(`${this.url}/${reportId}`);
  }

  async list(
    limit: number = 10,
    offset: number = 0
  ): Promise<Either<DataError, Pagination<Report>>> {
    return this.api.get<Pagination<Report>>(
      `${this.url}?limit=${limit}&offset=${offset}`
    );
  }

  async downloadReport(reportId: string): Promise<Either<DataError, Blob>> {
    return this.api.getBlob(`/file/report/${reportId}`);
  }

  async delete(reportId: string): Promise<Either<DataError, boolean>> {
    return this.api.delete(`${this.url}/${reportId}`);
  }
}
