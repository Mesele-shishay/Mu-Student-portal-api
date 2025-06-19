import { z, ZodSchema, ZodError } from "zod";
import type { ValidationError as ValidationErrorType } from "@/types";
import { ValidationError, BadRequestError } from "@/utils/errors";
import { createLogger } from "@/utils/logger";
import { Request, Response, NextFunction } from "express";

const logger = createLogger("ValidationMiddleware");

export interface ValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const errors: ValidationErrorType[] = [];

      // Validate request body
      if (schema.body && req.body) {
        try {
          schema.body.parse(req.body);
        } catch (err) {
          if (err instanceof ZodError) {
            err.errors.forEach((detail) => {
              errors.push({
                field: detail.path.join("."),
                message: detail.message,
                value: detail.code,
              });
            });
          } else {
            throw err;
          }
        }
      }

      // Validate query parameters
      if (schema.query && req.query) {
        try {
          schema.query.parse(req.query);
        } catch (err) {
          if (err instanceof ZodError) {
            err.errors.forEach((detail) => {
              errors.push({
                field: `query.${detail.path.join(".")}`,
                message: detail.message,
                value: detail.code,
              });
            });
          } else {
            throw err;
          }
        }
      }

      // Validate URL parameters
      if (schema.params && req.params) {
        try {
          schema.params.parse(req.params);
        } catch (err) {
          if (err instanceof ZodError) {
            err.errors.forEach((detail) => {
              errors.push({
                field: `params.${detail.path.join(".")}`,
                message: detail.message,
                value: detail.code,
              });
            });
          } else {
            throw err;
          }
        }
      }

      if (errors.length > 0) {
        logger.warn("Validation failed", {
          url: req.originalUrl,
          method: req.method,
          errors: errors.length,
        });
        throw new ValidationError(errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Common validation schemas using Zod
const cookieDataSchema = z.object({
  name: z.string(),
  value: z.string(),
  domain: z.string().optional(),
  path: z.string().optional().default("/"),
  expires: z.coerce.date().optional(),
  maxAge: z.number().int().optional(),
  secure: z.boolean().optional().default(false),
  httpOnly: z.boolean().optional().default(false),
  sameSite: z.enum(["strict", "lax", "none"]).optional().default("lax"),
});

export const commonSchemas = {
  pagination: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
  }),

  idParam: z.object({
    id: z.string().min(1),
  }),

  searchQuery: z.object({
    search: z.string().min(1).max(100).optional(),
    sort: z.enum(["asc", "desc"]).optional().default("asc"),
    order: z.string().min(1).max(50).optional(),
  }),

  urlParam: z.object({
    url: z.string().url(),
  }),

  scrapingOptions: z.object({
    url: z.string().url(),
    method: z.enum(["GET", "POST"]).optional().default("GET"),
    headers: z.record(z.string(), z.string()).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
    timeout: z.number().int().min(1000).max(60000).optional(),
    followRedirects: z.boolean().optional().default(true),
  }),

  htmlParseOptions: z.object({
    selector: z.string().min(1).optional(),
    attributes: z.array(z.string()).optional(),
    text: z.boolean().optional().default(false),
    html: z.boolean().optional().default(false),
    multiple: z.boolean().optional().default(false),
  }),

  cookieData: cookieDataSchema,

  // Login validation schemas
  loginCredentials: z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  }),

  sessionValidation: z.object({
    sessionId: z.string().min(1).optional(),
  }),

  cookieArray: z.array(cookieDataSchema),
};

// Validation helper functions
export const validateId = (id: string): boolean => {
  const result = commonSchemas.idParam.safeParse({ id });
  return result.success;
};

export const validateUrl = (url: string): boolean => {
  const result = commonSchemas.urlParam.safeParse({ url });
  return result.success;
};

export const validatePagination = (
  page: string,
  limit: string
): { page: number; limit: number } => {
  const result = commonSchemas.pagination.safeParse({ page, limit });
  if (!result.success) {
    throw new BadRequestError("Invalid pagination parameters");
  }
  return result.data;
};
