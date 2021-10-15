import { ReportRepository } from "./ReportRepository";
import { Report } from "./Report";
import { Either, DataError } from "../../common";

export class LoadReportByIdUseCase {
  constructor(private reportRepository: ReportRepository) {}

  execute(id: string): Promise<Either<DataError, Report>> {
    return this.reportRepository.getById(id);
  }
}
