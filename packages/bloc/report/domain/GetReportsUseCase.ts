import { ReportRepository } from "./ReportRepository";
import { Report } from "./Report";
import { Either, DataError, Pagination } from "../../common";
import { ItemQuery } from "../../../ui";

export class GetReportsUseCase {
  constructor(private reportRepository: ReportRepository) {}

  execute(query: ItemQuery): Promise<Either<DataError, Pagination<Report>>> {
    return this.reportRepository.list(query);
  }
}
