import { ReportRepository } from "./ReportRepository";
import { Report } from "./Report";
import { Either, DataError, Pagination } from "../../common";

export class GetReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  execute(): Promise<Either<DataError, Pagination<Report>>> {
    return this.reportRepository.list();
  }
}
