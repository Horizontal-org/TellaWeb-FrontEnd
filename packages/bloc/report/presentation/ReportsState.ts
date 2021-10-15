import { Pagination } from "../../common";
import { Report } from "../domain/Report";

export interface CommonReportsState {
  reports: Pagination<Report>;
  currentReport?: Report;
}

export interface LoadingReportsState {
  kind: "LoadingReportsState";
}

export interface LoadedReportsState {
  kind: "LoadedReportsState";
  reports: Pagination<Report>;
}

export interface ErrorReportsState {
  kind: "ErrorReportsState";
  error: string;
}

export type ReportsState = (
  | LoadingReportsState
  | LoadedReportsState
  | ErrorReportsState
) &
  CommonReportsState;

export const reportsInitialState: ReportsState = {
  kind: "LoadingReportsState",
  reports: {
    results: [],
    total: 0,
    limit: 5,
    offset: 0,
  },
};
