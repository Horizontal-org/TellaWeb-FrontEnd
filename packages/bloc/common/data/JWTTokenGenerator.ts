import Cookies from "js-cookie";
import { Credential, TokenGenerator } from "../domain";
import { ApiDataFetcher } from "./ApiDataFetcher";

interface LoginResponse {
  access_token: string;
}

export class JWTTokenGenerator implements TokenGenerator<string> {
  constructor(private dataFetcher: ApiDataFetcher) {}

  async getToken(credential: Credential): Promise<string> {
    const result = await this.dataFetcher.post<LoginResponse, Credential>(
      "/login",
      credential
    );
    const { access_token } = result.getOrThrow();
    this.saveToken(access_token);
    return access_token;
  }

  saveToken(token: string) {
    Cookies.set("access_token", token);
  }

  deleteToken() {
    Cookies.remove("access_token");
  }

  getSavedToken() {
    const access_token = Cookies.get("access_token");
    return access_token;
  }
}
