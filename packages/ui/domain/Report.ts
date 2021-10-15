import { Reporter } from "./Reporter";
import { IReportFile } from "./ReportFile";
import { Item } from "./Item";

export interface Report extends Item {
  author: Reporter;
  date?: number;
  files: IReportFile[];
}
