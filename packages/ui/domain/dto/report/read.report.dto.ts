import { FileDto } from "../file";
import { ReadUserDto } from "../user";

export class ReadReportDto {
  id: string;
  readonly title: string;
  readonly description: string;
  files: FileDto[] = [];
  author: ReadUserDto;
}
