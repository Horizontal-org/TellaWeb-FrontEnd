import {
  Either,
  DataError,  
} from "../../common";
import { User } from './User'
import { UserRepository } from "./UserRepository";

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(id: string, username: string): Promise<Either<DataError, User>> {
    const user = await this.userRepository.updateUser(id, username);
    return user;
  }
}
