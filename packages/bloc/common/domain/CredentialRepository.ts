import { Credential } from "./Credential";
import { Either, DataError } from "..";

export interface CredentialRepository {
  login(credential: Credential): Promise<Either<DataError, boolean>>;
  logout(): Promise<Either<DataError, boolean>>;
  token?: string;
  isLoggedIn: boolean;
}
