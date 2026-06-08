import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context: optionalParams[0] || null,
      stack: optionalParams[1] || null,
    };


    if (optionalParams.length > 2) {
      logEntry['extra'] = optionalParams.slice(2);
    }

    return JSON.stringify(logEntry);
  }


  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }


  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }


  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }


  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}