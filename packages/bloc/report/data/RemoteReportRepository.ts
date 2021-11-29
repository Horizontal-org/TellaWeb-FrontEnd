import { ApiDataFetcher, DataError, Either, Pagination } from "../../common";
import { Report, ReportRepository } from "../domain";
import { ItemQuery } from '../../../ui'

export class RemoteReportRepository implements ReportRepository {
  private url = "/report";

  constructor(private api: ApiDataFetcher) {}

  async getById(reportId: string): Promise<Either<DataError, Report>> {
    return this.api.get<Report>(`${this.url}/${reportId}`);
  }

  async list(query: ItemQuery): Promise<Either<DataError, Pagination<Report>>> {
    return this.api.get<Pagination<Report>>(
      `${this.url}?limit=${query.pagination.size}&offset=${query.pagination.page * query.pagination.size}&sort=${query.sort.key}&order=${query.sort.order}&search=${query.search}`
    );
  }

  async downloadReport(reportId: string): Promise<Either<DataError, Blob>> {
    return this.api.getBlob(`/file/report/${reportId}`);
  }

  async delete(reportId: string): Promise<Either<DataError, boolean>> {
    return this.api.delete(`${this.url}/${reportId}`);
  }
}
