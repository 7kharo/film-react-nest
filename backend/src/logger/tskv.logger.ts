import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  escapeValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      } catch {
        return String(value).replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // Для всех остальных типов (string, number, boolean, etc.)
    return String(value).replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  formatMessage(
    level: string,
    message: string | object,
    context?: string,
    stack?: string,
  ): string {
    const fields: Record<string, string> = {
      level: this.escapeValue(level),
      timestamp: this.escapeValue(new Date().toISOString()),
      message: this.escapeValue(
        typeof message === 'string' ? message : JSON.stringify(message),
      ),
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