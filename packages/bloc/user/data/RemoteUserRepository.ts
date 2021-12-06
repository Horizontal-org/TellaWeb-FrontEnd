import { ApiDataFetcher, DataError, Either } from "../../common";
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
}
