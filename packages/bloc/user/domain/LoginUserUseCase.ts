import {
  Either,
  DataError,
  Credential,
  CredentialRepository,
} from "../../common";
import { UserRepository } from "./UserRepository";
import { User } from "./User";

export class LoginUserUseCase {
  constructor(
    private credentialRepository: CredentialRepository,
    private userRepository: UserRepository
  ) {}

  async execute(credential?: Credential): Promise<Either<DataError, User>> {
    if (credential) await this.credentialRepository.login(credential);
    const user = await this.userRepository.getProfile();
    return user;
  }
}
