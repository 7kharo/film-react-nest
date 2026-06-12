import { Injectable, LoggerService } from '@nestjs/common';

interface LogEntry {
  level: string;
  timestamp: string;
  message: string;
  context?: string;
  stack?: string;
}

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(
    level: string,
    message: string | object,
    context?: string,
    stack?: string,
  ): string {
    const logEntry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };

    if (context) {
      logEntry.context = context;
    }
    if (stack) {
      logEntry.stack = stack;
    }

    return JSON.stringify(logEntry);
  }

  log(message: string | object, context?: string, stack?: string): void {
    console.log(this.formatMessage('log', message, context, stack));
  }

  error(message: string | object, context?: string, stack?: string): void {
    console.error(this.formatMessage('error', message, context, stack));
  }

  warn(message: string | object, context?: string, stack?: string): void {
    console.warn(this.formatMessage('warn', message, context, stack));
  }

  debug(message: string | object, context?: string, stack?: string): void {
    console.debug(this.formatMessage('debug', message, context, stack));
  }

  verbose(message: string | object, context?: string, stack?: string): void {
    console.log(this.formatMessage('verbose', message, context, stack));
  }
}