import type { AppError, ValidationError as ValidationErrorType } from "@/types";
import { Response } from "express";

// Custom error class
export class CustomError extends Error implements AppError {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// Specific error types
export class BadRequestError extends CustomError {
  constructor(message: string = "Bad Request", code?: string) {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized", code?: string) {
    super(message, 401, code);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Forbidden", code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = "Not Found", code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = "Conflict", code?: string) {
    super(message, 409, code);
  }
}

export class ValidationError extends CustomError {
  public readonly errors: ValidationErrorType[];

  constructor(
    errors: ValidationErrorType[],
    message: string = "Validation Error"
  ) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "Internal Server Error", code?: string) {
    super(message, 500, code, false);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = "Service Unavailable", code?: string) {
    super(message, 503, code, false);
  }
}

// Error factory
export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  isOperational: boolean = true
): CustomError => {
  return new CustomError(message, statusCode, code, isOperational);
};

// Error response formatter
export const formatErrorResponse = (
  error: Error
): { message: string; code?: string | undefined; details?: unknown } => {
  if (error instanceof CustomError) {
    return {
      message: error.message,
      code: error.code,
      details: error instanceof ValidationError ? error.errors : undefined,
    };
  }

  return {
    message: error.message || "Internal Server Error",
    code: "INTERNAL_ERROR",
  };
};

// Error handler for async functions
export const asyncHandler = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return (...args: T): Promise<R> => {
    return Promise.resolve(fn(...args)).catch((error) => {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new InternalServerError(error.message);
    });
  };
};

// Error handler for Express middleware
export const errorHandler = (
  error: Error,
  req: any,
  res: Response,
  next: any
): void => {
  const customError =
    error instanceof CustomError
      ? error
      : new InternalServerError(error.message);

  const errorResponse = {
    success: false,
    error: customError.message,
    code: customError.code,
    timestamp: new Date().toISOString(),
    ...(customError instanceof ValidationError && {
      details: customError.errors,
    }),
  };

  res.status(customError.statusCode).json(errorResponse);
};

// Error handler for unhandled rejections
export const handleUnhandledRejection = (
  reason: unknown,
  promise: Promise<unknown>
): void => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
};

// Error handler for uncaught exceptions
export const handleUncaughtException = (error: Error): void => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
};

// Setup global error handlers
export const setupErrorHandlers = (): void => {
  process.on("unhandledRejection", handleUnhandledRejection);
  process.on("uncaughtException", handleUncaughtException);
};
