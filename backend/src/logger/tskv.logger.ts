import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private escapeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    let str = String(value);
    str = str.replace(/[\n\r\t]/g, ' ');
    str = str.replace(/\s+/g, ' ').trim();
    return str;
  }


  private formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    const fields: Record<string, string> = {
      level: this.escapeValue(level),
      timestamp: this.escapeValue(new Date().toISOString()),
      message: this.escapeValue(typeof message === 'string' ? message : JSON.stringify(message)),
    };

    if (optionalParams[0]) {
      fields.context = this.escapeValue(optionalParams[0]);
    }

    if (optionalParams[1]) {
      fields.stack = this.escapeValue(optionalParams[1]);
    }

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
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