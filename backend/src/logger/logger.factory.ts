import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type LogFormat = 'dev' | 'json' | 'tskv';

export function createLogger(format: LogFormat = 'dev'): LoggerService {
  switch (format) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
    default:
      return new DevLogger();
  }
}

export function getLogFormatFromEnv(): LogFormat {
  const format = process.env.LOG_FORMAT?.toLowerCase();
  
  if (format === 'json' || format === 'tskv') {
    return format;
  }
  
  return 'dev';
}