export interface CommonFileState {}

export interface LoadingFileState {
  kind: "LoadingFileState";
}

export interface ErrorFileState {
  kind: "ErrorFileState";
  error: string;
}

export type FileState = (ErrorFileState | LoadingFileState) & CommonFileState;

export const fileInitialState: FileState = {
  kind: "LoadingFileState",
};
