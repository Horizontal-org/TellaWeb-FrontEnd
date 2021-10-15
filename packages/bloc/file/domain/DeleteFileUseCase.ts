import { FileRepository } from "./FileRepositroy";
import { Either, DataError } from "../../common";
import { BasicFileDto } from "./BasicFileDto";

export class DeleteFileUseCase {
  constructor(private fileRepository: FileRepository) {}

  execute(fileDto: BasicFileDto): Promise<Either<DataError, boolean>> {
    return this.fileRepository.delete(fileDto);
  }
}
