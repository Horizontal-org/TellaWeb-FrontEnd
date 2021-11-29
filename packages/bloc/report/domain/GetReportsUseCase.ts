import { ReportRepository } from "./ReportRepository";
import { Report } from "./Report";
import { ReportQuery } from "./ReportQuery";
import { Either, DataError, Pagination } from "../../common";

export class GetReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  execute(query?: ReportQuery): Promise<Either<DataError, Pagination<Report>>> {
    return this.reportRepository.list(query);
  }
}
