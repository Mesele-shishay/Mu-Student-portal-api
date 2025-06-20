import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "@/config";
import { requestLogger, defaultLogger } from "@/utils/logger";
import { errorHandler, setupErrorHandlers } from "@/utils/errors";
import {
  validateRequest,
  commonSchemas,
} from "@/middleware/validation.middleware";
import { StudentDataService } from "./services/student-data/student-data.service";
import { LoginCredentials } from "@/types";
import { version as expressVersion } from "express/package.json";
import { version as typescriptVersion } from "typescript/package.json";

// Initialize global error handlers
setupErrorHandlers();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin }));
app.use(helmet());
app.use(morgan("dev"));
app.use(requestLogger);

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    name: "MU eStudent API",
    version: "1.0.0",
    description: "Express.js API for accessing student data",
    status: {
      message: "✨ API is running smoothly",
      environment: process.env["NODE_ENV"] || "development",
      timestamp: new Date().toISOString(),
    },
    endpoints: {
      health: "GET /",
      data: "GET /student/data",
    },
    tech_stack: {
      runtime: `Node.js ${process.version}`,
      framework: `Express.js ${expressVersion}`,
      language: `TypeScript ${typescriptVersion}`,
      database: "None (Web Scraping)",
    },
    maintainer: {
      github: "https://github.com/mesele-shishay",
      email: "messeleshishaymm@gmail.com",
      twitter: "https://x.com/mesele_shishay",
      linkedin: "https://www.linkedin.com/in/mesele-shishay/",
      website: "https://meselecodes.vercel.app",
      telegram: "https://t.me/mesele_shishay",
      instagram: "https://www.instagram.com/mesele_shishay/",
      facebook: "https://www.facebook.com/mesele.shishay.3",
      youtube: "https://www.youtube.com/c/mesatube",
    },
  });
});

// Feature: Student Data Service
const studentDataService = new StudentDataService();

// Get all student data (login + scrape) - POST method
app.post(
  "/student/data",
  validateRequest({ body: commonSchemas.loginCredentials }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentData = await studentDataService.getStudentData(req.body);
      res.json({
        success: true,
        data: studentData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all student data (login + scrape) - GET method
app.get(
  "/student/data",
  validateRequest({ query: commonSchemas.loginCredentials }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials: LoginCredentials = {
        username: req.query["username"] as string,
        password: req.query["password"] as string,
      };
      const studentData = await studentDataService.getStudentData(credentials);
      res.json({
        success: true,
        data: studentData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
);

// 404 handler
app.use((res: Response) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

// Only start the server if we're running locally (not on Vercel)
if (process.env["VERCEL"] !== "1") {
  const port = process.env["PORT"] || config.port || 3000;
  app.listen(port, () => {
    defaultLogger.info(`Server running on port ${port} [${config.nodeEnv}]`);
  });
}

// Export the app for Vercel serverless functions
export default app;
