import { ReportRepository } from "./ReportRepository";
import { Either, DataError } from "../../common";
import { Report } from '../../../ui/domain'

export class BatchDeleteReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  execute(toDelete: Report[]): Promise<Either<DataError, boolean>> {
    return this.reportRepository.batchDelete(toDelete);
  }
}
