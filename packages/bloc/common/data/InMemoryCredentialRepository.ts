import { Credential, CredentialRepository, UnauthorizedError } from "..";
import { Either, UnexpectedError, TokenGenerator } from "..";

export class InMemoryCredentailRepository implements CredentialRepository {
  static _credential: Credential | undefined;
  static _token: string | undefined;

  constructor(private tokenGenerator: TokenGenerator<string>) {
    InMemoryCredentailRepository._token = this.tokenGenerator.getSavedToken();
  }

  async login(
    credential: Credential
  ): Promise<Either<UnexpectedError, boolean>> {
    try {
      InMemoryCredentailRepository._credential = credential;
      InMemoryCredentailRepository._token = await this.tokenGenerator.getToken(
        credential
      );
      return Either.right(true);
    } catch (e) {
      return Either.left(new UnauthorizedError(e.message));
    }
  }
  async logout(): Promise<Either<UnexpectedError, boolean>> {
    InMemoryCredentailRepository._credential = undefined;
    InMemoryCredentailRepository._token = undefined;
    this.tokenGenerator.deleteToken();
    return Either.right(true);
  }

  public get token(): string {
    return InMemoryCredentailRepository._token;
  }

  public get isLoggedIn(): boolean {
    return typeof this.token !== "undefined";
  }
}
