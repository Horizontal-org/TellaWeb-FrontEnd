import {
  Either,
  DataError,  
} from "../../common";
import { User } from './User'
import { UserRepository } from "./UserRepository";

export class UpdatePasswordUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(currentPassword: string, newPassword: string): Promise<Either<DataError, boolean>> {
    const success = await this.userRepository.updatePassword(currentPassword, newPassword);
    return success;
  }
}
