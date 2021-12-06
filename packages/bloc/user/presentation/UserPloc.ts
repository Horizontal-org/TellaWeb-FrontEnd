import { Ploc, DataError, Credential } from "../../common";
import { LoginUserUseCase, LogoutUserUseCase } from "../domain";
import { ValidateEmailUseCase } from "../domain/ValidateEmailUseCase";
import { authInitialState, AuthState } from "./AuthState";
import { userInitialState, UserState } from "./UserState";

export class UserPloc extends Ploc<UserState> {
  constructor(
    private validateEmailUseCase: ValidateEmailUseCase,
  ) {
    super(userInitialState);
  }

  async validateEmail(email: string) {
    const validationResult = await this.validateEmailUseCase.execute(email)

    validationResult.fold(
      (error) => {
        if (error.kind === 'NotFoundError') {
          this.changeState({
            kind: 'ValidatedEmailState',
            mailAvailable: true
          })
          return 
        }

        this.changeState(this.handleError(error))
      },
      (user) => {
        this.changeState({
          kind: 'ValidatedEmailState',
          mailAvailable: false
        })
      }
    )
  }

  // async updateUsername(username: string) {
  //   const updateResult = await this.updateUsernameUseCase.execute(username)

  //   updateResult.fold(
  //     (error) => {
  //       this.changeState(this.handleError(error))
  //     },
  //     (user) => {
  //       this.changeState({
  //         kind: 'UpdateUsernameSuccess',
  //       })
  //     }
  //   )
  // }

  private handleError(error: DataError): UserState {
    switch (error.kind) {
      default: {
        return {
          kind: "ErrorUserState",
          error: "Sorry, an error has ocurred. Please try later again",
        };
      }
    }
  }
}
