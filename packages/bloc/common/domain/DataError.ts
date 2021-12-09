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

export class NotFoundError {
  public kind = "NotFoundError";
  constructor(public message: Error) {}
}

export class NotAllowedError {
  public kind = "NotAllowedError"
  constructor(public message: Error) {}
}

export class ConflictError {
  public kind = 'ConflictError'
  constructor(public message: Error) {}
}

export type DataError = UnexpectedError | ConflictError | NotAllowedError | UnauthorizedError | NetworkError | NotFoundError;
