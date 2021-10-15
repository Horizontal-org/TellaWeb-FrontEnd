import { ReportRepository } from "./ReportRepository";
import { Either, DataError } from "../../common";

export class DeleteReportByIdUseCase {
  constructor(private reportRepository: ReportRepository) {}

  execute(reportId: string): Promise<Either<DataError, boolean>> {
    return this.reportRepository.delete(reportId);
  }
}
