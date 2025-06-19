import dotenv from "dotenv";
import { z } from "zod";
import type { AppConfig, LogLevel } from "@/types";

// Load environment variables
dotenv.config();

// Configuration validation schema using Zod
const configSchema = z.object({
  port: z.coerce.number().default(3000),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  logLevel: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
  corsOrigin: z.string().default("http://localhost:3000"),
  requestTimeout: z.coerce.number().default(30000),
  userAgent: z
    .string()
    .default(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ),
});

// Raw configuration from environment variables
const rawConfig = {
  port: process.env["PORT"],
  nodeEnv: process.env["NODE_ENV"],
  logLevel: process.env["LOG_LEVEL"],
  corsOrigin: process.env["CORS_ORIGIN"],
  requestTimeout: process.env["REQUEST_TIMEOUT"],
  userAgent: process.env["USER_AGENT"],
};

const parsed = configSchema.safeParse(rawConfig);

if (!parsed.success) {
  throw new Error(`Configuration validation error: ${parsed.error.message}`);
}

// Export validated configuration
export const config: AppConfig = parsed.data;

// Configuration helper functions
export const isDevelopment = (): boolean => config.nodeEnv === "development";
export const isProduction = (): boolean => config.nodeEnv === "production";
export const isTest = (): boolean => config.nodeEnv === "test";

export const getLogLevel = (): keyof LogLevel => config.logLevel;
export const getPort = (): number => config.port;
export const getCorsOrigin = (): string => config.corsOrigin;
export const getRequestTimeout = (): number => {
  return parseInt(process.env["REQUEST_TIMEOUT"] || "30000", 10);
};
export const getUserAgent = (): string => {
  return (
    process.env["USER_AGENT"] ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
};
