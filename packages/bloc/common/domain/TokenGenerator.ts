import { Credential } from "..";

export interface TokenGenerator<T> {
  getToken: (credential: Credential) => Promise<T>;
  saveToken: (T) => void;
  getSavedToken: () => T;
  deleteToken: () => void;
}
