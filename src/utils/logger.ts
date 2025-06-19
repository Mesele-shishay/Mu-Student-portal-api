import winston from "winston";
import type { LogLevel, LogEntry } from "@/types";
import { getLogLevel, isDevelopment } from "@/config";
import type { Request, Response, NextFunction } from "express";

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const logEntry: LogEntry = {
      level: level as keyof LogLevel,
      message: message as string,
      timestamp: timestamp as string,
      meta:
        Object.keys(meta).length > 0
          ? (meta as Record<string, unknown>)
          : undefined,
    };

    if (isDevelopment()) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}${
        stack ? `\n${stack}` : ""
      }`;
    }

    return JSON.stringify(logEntry);
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: getLogLevel(),
  format: logFormat,
  defaultMeta: { service: "mu-estudent-api" },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console as well
if (isDevelopment()) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Logger interface
export interface Logger {
  error: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  http: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
}

// Create logger wrapper with proper typing
export const createLogger = (context?: string): Logger => {
  const contextPrefix = context ? `[${context}] ` : "";

  return {
    error: (message: string, meta?: Record<string, unknown>): void => {
      logger.error(`${contextPrefix}${message}`, meta);
    },
    warn: (message: string, meta?: Record<string, unknown>): void => {
      logger.warn(`${contextPrefix}${message}`, meta);
    },
    info: (message: string, meta?: Record<string, unknown>): void => {
      logger.info(`${contextPrefix}${message}`, meta);
    },
    http: (message: string, meta?: Record<string, unknown>): void => {
      logger.http(`${contextPrefix}${message}`, meta);
    },
    debug: (message: string, meta?: Record<string, unknown>): void => {
      logger.debug(`${contextPrefix}${message}`, meta);
    },
  };
};

// Default logger instance
export const defaultLogger = createLogger();

// Request logger middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  (req as any).startTime = start;

  (res as any).on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${(req as any).method} ${(req as any).originalUrl} ${
      (res as any).statusCode
    } ${duration}ms`;

    if ((res as any).statusCode >= 400) {
      defaultLogger.error(logMessage, {
        method: (req as any).method,
        url: (req as any).originalUrl,
        statusCode: (res as any).statusCode,
        duration,
        userAgent: (req as any).get("User-Agent"),
        ip: (req as any).ip,
      });
    } else {
      defaultLogger.http(logMessage, {
        method: (req as any).method,
        url: (req as any).originalUrl,
        statusCode: (res as any).statusCode,
        duration,
        userAgent: (req as any).get("User-Agent"),
        ip: (req as any).ip,
      });
    }
  });

  next();
};
