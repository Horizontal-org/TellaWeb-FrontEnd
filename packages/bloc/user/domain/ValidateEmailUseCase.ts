import {
  Either,
  DataError,  
} from "../../common";
import { User } from './User'
import { UserRepository } from "./UserRepository";

export class ValidateEmailUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(email: string): Promise<Either<DataError, User>> {
    const isValid = await this.userRepository.validateEmail(email);
    return isValid;
  }
}
