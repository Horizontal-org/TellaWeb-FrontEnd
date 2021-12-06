export interface CommonUserState {
  mailAvailable?: boolean
}

export interface StandByState {
  kind: "StandByState";
}

export interface ValidatedEmailState {
  kind: "ValidatedEmailState";
  mailAvailable: boolean
}

export interface ErrorUserState {
  kind: "ErrorUserState";
  error: string;
}

export interface UpdateUsernameSuccess {
  kind: 'UpdateUsernameSuccess'
}

export type UserState = (StandByState | ValidatedEmailState | UpdateUsernameSuccess | ErrorUserState) &
CommonUserState;

export const userInitialState: UserState = {
  kind: "StandByState"
};
