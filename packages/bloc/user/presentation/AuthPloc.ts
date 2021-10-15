import { Ploc, DataError, Credential } from "../../common";
import { LoginUserUseCase, LogoutUserUseCase } from "../domain";
import { authInitialState, AuthState } from "./AuthState";

export class AuthPloc extends Ploc<AuthState> {
  constructor(
    private loginUserUseCase: LoginUserUseCase,
    private logoutUserUseCase: LogoutUserUseCase
  ) {
    super(authInitialState);
    this.login();
  }

  async logout() {
    const logoutResult = await this.logoutUserUseCase.execute();

    logoutResult.fold(
      (error) => this.changeState(this.handleError(error)),
      () =>
        this.changeState({
          kind: "LoadedAuthState",
          username: undefined,
          loggedIn: false,
        })
    );
  }

  async login(credentail?: Credential) {
    const logoutResult = await this.loginUserUseCase.execute(credentail);

    logoutResult.fold(
      (error) => this.changeState(this.handleError(error)),
      (user) => {
        this.changeState({
          kind: "LoadedAuthState",
          username: user.username,
          loggedIn: true,
        });
      }
    );
  }

  private handleError(error: DataError): AuthState {
    switch (error.kind) {
      case "UnauthorizedError": {
        return {
          kind: "ErrorAuthState",
          error: "Sorry, invalid username or password",
          username: undefined,
          loggedIn: false,
        };
      }
      default: {
        return {
          kind: "ErrorAuthState",
          error: "Sorry, an error has ocurred. Please try later again",
          username: undefined,
          loggedIn: false,
        };
      }
    }
  }
}
