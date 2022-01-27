import fetch from "isomorphic-fetch";
import {
  DataError,
  Either,
  NetworkError,
  UnauthorizedError,
  UnexpectedError,
  NotFoundError,
  NotAllowedError,
  ConflictError,
} from "../domain";

type Method = "GET" | "POST" | "DELETE" | "PUT";

export class ApiDataFetcher {
  constructor(private baseUrl: string) {}

  private getAuthHeader = () => {
    const access_token = localStorage.getItem("access_token");
    return {
      credentials: "include",
      Authorization: access_token ? `Bearer ${access_token}` : undefined,
    };
  };
  private async request<P, D = undefined>(
    method: Method,
    url: string,
    body?: D
  ): Promise<Either<DataError, P>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers: new Headers({
          "content-type": "application/json",
          ...this.getAuthHeader(),
        }),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!response.ok) {
        const errorObject = await response.json();
        switch (response.status) {
          case 401:
            return Either.left(
              new UnauthorizedError(new Error(response.statusText))
            );

          case 404:
            return Either.left(
              new NotFoundError(new Error(response.statusText))
            );

          case 405:
            return Either.left(
              new NotAllowedError(new Error(errorObject.message))
            );
          case 409:
            return Either.left(
              new ConflictError(new Error(errorObject.message))
            );
          default:
            return Either.left(
              new UnexpectedError(new Error(response.statusText))
            );
        }
      }

      const data: P = await response.json();
      return Either.right(data);
    } catch (e) {
      return Either.left(new NetworkError(e));
    }
  }

  private async requestBlob(url: string): Promise<Either<DataError, Blob>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        headers: new Headers({
          //"content-type": "application/json",
          ...this.getAuthHeader(),
        }),
      });
      if (!response.ok) {
        switch (response.status) {
          case 401:
            return Either.left(
              new UnauthorizedError(new Error(response.statusText))
            );

          default:
            return Either.left(
              new UnexpectedError(new Error(response.statusText))
            );
        }
      }
      const data = await response.blob();
      return Either.right(data);
    } catch (e) {
      return Either.left(new NetworkError(e));
    }
  }

  get<P>(url: string): Promise<Either<DataError, P>> {
    return this.request<P>("GET", url);
  }

  post<P, D>(url: string, data: D): Promise<Either<DataError, P>> {
    return this.request<P, D>("POST", url, data);
  }

  put<P, D>(url: string, data: D): Promise<Either<DataError, P>> {
    return this.request<P, D>("PUT", url, data);
  }

  delete<P, D>(url: string): Promise<Either<DataError, P>> {
    return this.request<P, D>("DELETE", url);
  }

  getBlob(url: string): Promise<Either<DataError, Blob>> {
    return this.requestBlob(url);
  }
}
