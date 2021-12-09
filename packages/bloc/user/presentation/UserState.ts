import {User} from '../domain/User'

export interface CommonUserState {
  user?: User | null
}

export interface StandByState {
  kind: "StandByState";
}

export interface LoadedUser {
  kind: "LoadedUser";
  user: User;
}

export interface AttemptUpdate {
  kind: 'AttemptUpdate'
}

export interface PasswordUpdated {
  kind: "PasswordUpdated";  
}

export interface UsernameUpdated { 
  kind: 'UsernameUpdated'
}

export interface ErrorUserState {
  kind: "ErrorUserState";
  error: string;
}

export interface UpdateFailed {
  kind: "UpdateFailed";
  error: string;
}

export type UserState = (
  StandByState | 
  LoadedUser | 
  UsernameUpdated | 
  PasswordUpdated | 
  ErrorUserState |
  AttemptUpdate | 
  UpdateFailed
) & CommonUserState;

export const userInitialState: UserState = {
  kind: "StandByState",
  user: null,
};
