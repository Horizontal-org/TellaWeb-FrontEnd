import { Ploc, DataError, Credential } from "../../common";
import { GetProfileUseCase, UpdateUserUseCase, UpdatePasswordUseCase } from "../domain";
import { authInitialState, AuthState } from "./AuthState";
import { userInitialState, UserState } from "./UserState";

export class UserPloc extends Ploc<UserState> {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase
  ) {
    super(userInitialState);
  }

  async getProfile() {    
    const profileResult = await this.getProfileUseCase.execute()

    profileResult.fold(
      (error) => this.changeState(this.handleError(error)),
      (user) => {
        this.changeState({
          kind: 'LoadedUser',
          user: user
        })
      }
    )    
  }
 
  async updatePassword(currentPassword: string, newPassword: string) {
    this.changeState({ kind: 'AttemptUpdate' })
    const updateResult = await this.updatePasswordUseCase.execute(currentPassword, newPassword)
    updateResult.fold(
      (error) => {
        this.changeState(this.handleError(error))
      },
      () => {
        this.changeState({
          kind: 'PasswordUpdated',
        })
      }
    )
  }

  async updateUsername(id: string, username: string) {
    this.changeState({ kind: 'AttemptUpdate' })
    const updateResult = await this.updateUserUseCase.execute(id, username)
    updateResult.fold(
      (error) => {
        this.changeState(this.handleError(error))
      },
      (user) => {
        this.changeState({
          kind: 'UsernameUpdated',
          user: user
        })
      }
    )
  }

  private handleError(error: DataError): UserState {
    switch (error.kind) {
      case "NotAllowedError": {
        return {
          kind: "UpdateFailed",
          error: error.message.message,
        };
      }
      case "ConflictError": {
        return {
          kind: "UpdateFailed",
          error: error.message.message,
        };
      }
      default: {
        return {
          kind: "ErrorUserState",
          error: "Sorry, an error has ocurred. Please try later again",
        };
      }
    }
  }
}
