import { Either, DataError } from "../../common";
import { User } from "./User";

export interface UserRepository {
  getProfile(): Promise<Either<DataError, User>>;
  validateEmail(email: string): Promise<Either<DataError, User>>
}
