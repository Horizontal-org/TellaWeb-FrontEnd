import { ApiDataFetcher, DataError, Either } from "../../common";
import { FileRepository, File, BasicFileDto } from "../domain";

export class RemoteFileRepository implements FileRepository {
  private url = "/file";

  constructor(private api: ApiDataFetcher) {}

  async download(fileDto: BasicFileDto): Promise<Either<DataError, Blob>> {
    return this.api.getBlob(
      `${this.url}/asset/${fileDto.bucket}/${fileDto.id}`
    );
  }

  async downloadAllReportFiles(
    reportId: string
  ): Promise<Either<DataError, Blob>> {
    return this.api.getBlob(`${this.url}/report/${reportId}`);
  }

  async delete(fileDto: BasicFileDto): Promise<Either<DataError, boolean>> {
    return this.api.delete(`${this.url}/${fileDto.bucket}/${fileDto.id}`);
  }
}
