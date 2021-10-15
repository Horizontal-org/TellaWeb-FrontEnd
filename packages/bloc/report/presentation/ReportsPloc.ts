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

  async list() {
    const reportsResult = await this.getReportsUseCase.execute();

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
