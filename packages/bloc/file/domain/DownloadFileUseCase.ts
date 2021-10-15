import { FileRepository } from "./FileRepositroy";
import { Either, DataError } from "../../common";
import { BasicFileDto } from "./BasicFileDto";

export class DownloadFileUseCase {
  constructor(private fileRepository: FileRepository) {}

  execute(fileDto: BasicFileDto): Promise<Either<DataError, Blob>> {
    return this.fileRepository.download(fileDto);
  }
}
