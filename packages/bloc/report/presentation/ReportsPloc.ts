import { ItemQuery } from "../../../ui";
import { DataError, Ploc, UnexpectedError } from "../../common";
import { GetReportsUseCase, LoadReportByIdUseCase } from "../domain";
import { DeleteReportByIdUseCase } from "../domain/DeleteReportByIdUseCase";
import { addThumbnail } from "../utils/addThumbnail";
import { reportsInitialState, ReportsState } from "./ReportsState";

export class ReportsPloc extends Ploc<ReportsState> {
  constructor(
    private getReportsUseCase: GetReportsUseCase,
    private loadReportByIdUseCase: LoadReportByIdUseCase,
    private deleteReporByIdUseCase: DeleteReportByIdUseCase
  ) {
    super(reportsInitialState);
  }

  async list(query: ItemQuery) {
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

  async delete(reportId: string, query: ItemQuery) {
    const deleteResult = await this.deleteReporByIdUseCase.execute(reportId);
    deleteResult.fold(
      (error) => this.changeState(this.handleError(error)),
      () => {
        this.list(query);
      }
    );
  }

  private prepareQuery(query: ItemQuery) {
    const parsedKey = {
      'Name': 'report.title',    
      'Date': 'report.createdAt'
    }

    const newQuery = {
      ...query,
      sort: {
        order: query.sort.order,
        key: parsedKey[query.sort.key] || ''
      }
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
