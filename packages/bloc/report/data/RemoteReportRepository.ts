import { ApiDataFetcher, DataError, Either, Pagination } from "../../common";
import { Report, ReportRepository } from "../domain";
import { ReportQuery } from "../domain/ReportQuery";
import { Report as UiReport } from "../../../ui/domain/Report";

export class RemoteReportRepository implements ReportRepository {
  private url = "/report";

  constructor(private api: ApiDataFetcher) {}

  async getById(reportId: string): Promise<Either<DataError, Report>> {
    return this.api.get<Report>(`${this.url}/${reportId}`);
  }

  async list(query: ReportQuery = {
    page: 0,
    size: 25,
    search: '',
    sortKey: '',
    sortOrder: ''
  }): Promise<Either<DataError, Pagination<Report>>> {
    return this.api.get<Pagination<Report>>(
      `${this.url}?limit=${query.size}&offset=${query.page * query.size}&sort=${query.sortKey}&order=${query.sortOrder}&search=${query.search}`
    );
  }

  async downloadReport(reportId: string): Promise<Either<DataError, Blob>> {
    return this.api.getBlob(`/file/report/${reportId}`);
  }

  async delete(reportId: string): Promise<Either<DataError, boolean>> {
    return this.api.delete(`${this.url}/${reportId}`);
  }

  async batchDelete(toDelete: UiReport[]): Promise<Either<DataError, boolean>> {    
    return this.api.post(`${this.url}/batch-delete`, {
      toDelete: toDelete.map(d => d.id) 
    })
  }
}
