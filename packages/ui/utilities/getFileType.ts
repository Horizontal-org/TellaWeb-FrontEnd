import { ReportFileType } from "../domain/ReportFileType";

export const getFileType = (fileName: string): ReportFileType => {
  return ReportFileType.OTHER;
};
