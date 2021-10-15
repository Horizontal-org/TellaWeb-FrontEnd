import { Either, DataError, CredentialRepository } from "../../common";

export class LogoutUserUseCase {
  private credentialRepository: CredentialRepository;

  constructor(credentialRepository: CredentialRepository) {
    this.credentialRepository = credentialRepository;
  }

  execute(): Promise<Either<DataError, boolean>> {
    return this.credentialRepository.logout();
  }
}
