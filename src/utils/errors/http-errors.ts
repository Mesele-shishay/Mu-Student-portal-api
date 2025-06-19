import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message: string) {
    super(message, 503, "SERVICE_UNAVAILABLE");
  }
}
