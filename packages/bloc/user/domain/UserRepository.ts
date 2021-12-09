import { Either, DataError } from "../../common";
import { User } from "./User";

export interface UserRepository {
  getProfile(): Promise<Either<DataError, User>>;
  validateEmail(email: string): Promise<Either<DataError, User>>
  updateUser(id: string, username: string): Promise<Either<DataError, User>>
  updatePassword(currentPassword:string, newPassword: string): Promise<Either<DataError, boolean>>
}
