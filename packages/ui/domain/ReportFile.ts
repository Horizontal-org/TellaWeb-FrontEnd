import { FileDto } from "./dto/file";
import { ReportFileType } from "./ReportFileType";

export interface IReportFile extends FileDto {
  src: string;
  size: number;
  thumbnail?: string;
  type: ReportFileType;
}
