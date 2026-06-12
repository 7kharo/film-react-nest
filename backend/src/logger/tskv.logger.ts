import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  escapeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      try {
        value = JSON.stringify(value);
      } catch {
        value = String(value);
      }
    }

    let str = String(value);
    str = str.replace(/[\n\r\t]/g, ' ');
    str = str.replace(/\s+/g, ' ').trim();
    return str;
  }

  formatMessage(level: string, message: any, context?: string, stack?: string): string {
    const fields: Record<string, string> = {
      level: this.escapeValue(level),
      timestamp: this.escapeValue(new Date().toISOString()),
      message: this.escapeValue(typeof message === 'string' ? message : JSON.stringify(message)),
    };

    if (context) {
      fields.context = this.escapeValue(context);
    }
    if (stack) {
      fields.stack = this.escapeValue(stack);
    }

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
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