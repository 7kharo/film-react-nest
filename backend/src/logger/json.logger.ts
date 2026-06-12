import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: any, context?: string, stack?: string): string {
    const logEntry: Record<string, any> = {
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

  log(message: any, ...optionalParams: any[]) {
    const [context, stack] = optionalParams;
    console.log(this.formatMessage('log', message, context, stack));
  }

  error(message: any, ...optionalParams: any[]) {
    const [context, stack] = optionalParams;
    console.error(this.formatMessage('error', message, context, stack));
  }

  warn(message: any, ...optionalParams: any[]) {
    const [context, stack] = optionalParams;
    console.warn(this.formatMessage('warn', message, context, stack));
  }

  debug(message: any, ...optionalParams: any[]) {
    const [context, stack] = optionalParams;
    console.debug(this.formatMessage('debug', message, context, stack));
  }

  verbose(message: any, ...optionalParams: any[]) {
    const [context, stack] = optionalParams;
    console.log(this.formatMessage('verbose', message, context, stack));
  }
}