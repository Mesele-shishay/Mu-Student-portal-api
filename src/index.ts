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
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Feature: Student Data Service
const studentDataService = new StudentDataService();

// Get all student data (login + scrape)
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

// Start server
app.listen(config.port, () => {
  defaultLogger.info(
    `Server running on port ${config.port} [${config.nodeEnv}]`
  );
});
