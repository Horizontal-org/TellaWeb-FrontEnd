export interface CommonAuthState {
  username?: string;
  loggedIn?: boolean;
}

export interface LoadingAuthState {
  kind: "LoadingAuthState";
}

export interface LoadedAuthState {
  kind: "LoadedAuthState";
}

export interface ErrorAuthState {
  kind: "ErrorAuthState";
  error: string;
}

export type AuthState = (LoadingAuthState | LoadedAuthState | ErrorAuthState) &
  CommonAuthState;

export const authInitialState: AuthState = {
  kind: "LoadingAuthState",
  username: undefined,
  loggedIn: undefined,
};
