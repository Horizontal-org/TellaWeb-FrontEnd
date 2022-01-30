import { ApiDataFetcher, DataError, Either } from "../../common";
import { FileRepository } from "../domain";

export class RemoteFileRepository implements FileRepository {
  private url = "/file";

  constructor(private api: ApiDataFetcher) {}

  async downloadAllReportFiles(
    reportId: string
  ): Promise<Either<DataError, Blob>> {
    return this.api.getBlob(`${this.url}/report/${reportId}`);
  }
}
