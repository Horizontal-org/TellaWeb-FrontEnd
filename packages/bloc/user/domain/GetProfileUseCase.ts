import {
  Either,
  DataError,  
} from "../../common";
import { User } from './User'
import { UserRepository } from "./UserRepository";

export class GetProfileUseCase {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(): Promise<Either<DataError, User>> {
    const user = await this.userRepository.getProfile();
    return user;
  }
}
