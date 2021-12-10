import { ItemQuery } from "../../../ui";
import { DataError, Ploc, UnexpectedError } from "../../common";
import { GetReportsUseCase, LoadReportByIdUseCase, BatchDeleteReportUseCase } from "../domain";
import { DeleteReportByIdUseCase } from "../domain/DeleteReportByIdUseCase";
import { ReportQuery } from "../domain/ReportQuery";
import { addThumbnail } from "../utils/addThumbnail";
import { reportsInitialState, ReportsState } from "./ReportsState";
import { Report } from '../../../ui/domain/Report'

export class ReportsPloc extends Ploc<ReportsState> {
  constructor(
    private getReportsUseCase: GetReportsUseCase,
    private loadReportByIdUseCase: LoadReportByIdUseCase,
    private deleteReporByIdUseCase: DeleteReportByIdUseCase,
    private batchDeleteReportUseCase: BatchDeleteReportUseCase
  ) {
    super(reportsInitialState);
  }

  async list(query?: ItemQuery) {
    const reportsResult = await this.getReportsUseCase.execute(this.prepareQuery(query));

    reportsResult.fold(
      (error) => this.changeState(this.handleError(error)),
      (reports) =>
        this.changeState({
          kind: "LoadedReportsState",
          reports: {
            ...reports,
            results: reports.results.map(addThumbnail),
          },
        })
    );
  }

  async open(reportId: string) {
    const openResult = await this.loadReportByIdUseCase.execute(reportId);
    openResult.fold(
      (error) => this.changeState(this.handleError(error)),
      (report) => {
        this.changeState({ ...this.state, currentReport: report });
      }
    );
  }

  async delete(reportId: string) {
    const deleteResult = await this.deleteReporByIdUseCase.execute(reportId);
    deleteResult.fold(
      (error) => this.changeState(this.handleError(error)),
      () => {
        this.list();
      }
    );
  }

  async batchDelete(toDelete: Report[]) {
    const deleteResult = await this.batchDeleteReportUseCase.execute(toDelete);
    deleteResult.fold(
      (error) => this.changeState(this.handleError(error)),
      () => {
        this.changeState({
          ...this.state,
          kind: 'DeletedReportsState'
        })
      }
    );
  }


  private prepareQuery (query: ItemQuery): ReportQuery {
    const parsedKey = {
      'Name': 'report.title',    
      'Date': 'report.createdAt'
    }

    const newQuery = {
      search: query ? query.search : '',
      sortKey: query ? (parsedKey[query.sort.key] || '') : '',
      sortOrder: query ? query.sort.order : '',
      page: query ? query.pagination.page : 0,
      total: query ? query.pagination.total : 1,
      size: query ? query.pagination.size : 25,
    }
    
    return newQuery 
  } 

  private handleError(error: DataError): ReportsState {
    switch (error.kind) {
      case "UnexpectedError": {
        return {
          ...this.state,
          kind: "ErrorReportsState",
          error: "Sorry, an error has ocurred. Please try later again",
        };
      }
    }
  }
}
