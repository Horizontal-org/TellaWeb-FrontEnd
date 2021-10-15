export class UnexpectedError {
  public kind = "UnexpectedError";
  constructor(public message: Error) {}
}

export class UnauthorizedError {
  public kind = "UnauthorizedError";
  constructor(public message: Error) {}
}

export class NetworkError {
  public kind = "NetworkError";
  constructor(public message: Error) {}
}

export type DataError = UnexpectedError | UnauthorizedError | NetworkError;
