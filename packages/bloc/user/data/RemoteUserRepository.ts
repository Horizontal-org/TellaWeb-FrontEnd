import { ApiDataFetcher, DataError, Either, UnauthorizedError } from "../../common";
import { User, UserRepository } from "../domain";

export class RemoteUserRepository implements UserRepository {
  private url = "/user";

  constructor(private api: ApiDataFetcher) {}

  async getProfile(): Promise<Either<DataError, User>> {
    return this.api.get<User>(`${this.url}`);
  }

  async validateEmail(email: string): Promise<Either<DataError, User>> {
    return this.api.get(`${this.url}/${email}`)
  }

  async updateUser(id, username: string): Promise<Either<DataError, User>> {
    return this.api.post(`${this.url}/${id}`, {
      username: username,
      isAdmin: true
    })    
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<Either<DataError, boolean>> {
    const res: Promise<Either<DataError, boolean>> = this.api.post(`${this.url}/change-password`, {
      current: currentPassword,
      new: newPassword
    })
    return res    
  }
}
