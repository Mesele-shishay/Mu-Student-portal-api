type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMessage {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  data?: Record<string, unknown>;
}

export class Logger {
  constructor(private readonly service: string) {}

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>
  ) {
    const logMessage: LogMessage = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      ...(data && { data }),
    };

    console.log(JSON.stringify(logMessage));
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log("info", message, data);
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log("warn", message, data);
  }

  error(message: string, data?: Record<string, unknown>) {
    this.log("error", message, data);
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log("debug", message, data);
  }
}

export const createLogger = (service: string): Logger => {
  return new Logger(service);
};
