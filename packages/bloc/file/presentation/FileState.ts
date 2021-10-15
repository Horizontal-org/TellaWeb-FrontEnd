export interface CommonFileState {}

export interface LoadingFileState {
  kind: "LoadingFileState";
}

export interface DeletedFileState {
  kind: "DeletedFileState";
  fileName: string;
}

export interface ErrorFileState {
  kind: "ErrorFileState";
  error: string;
}

export type FileState = (ErrorFileState | LoadingFileState | DeletedFileState) &
  CommonFileState;

export const fileInitialState: FileState = {
  kind: "LoadingFileState",
};
