import { createLogger, getLogFormatFromEnv } from '../logger.factory';
import { DevLogger } from '../dev.logger';
import { JsonLogger } from '../json.logger';
import { TskvLogger } from '../tskv.logger';

describe('Logger Factory', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('createLogger', () => {
    it('should create DevLogger when format is "dev"', () => {
      const logger = createLogger('dev');
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should create JsonLogger when format is "json"', () => {
      const logger = createLogger('json');
      expect(logger).toBeInstanceOf(JsonLogger);
    });

    it('should create TskvLogger when format is "tskv"', () => {
      const logger = createLogger('tskv');
      expect(logger).toBeInstanceOf(TskvLogger);
    });

    it('should create DevLogger by default when no format provided', () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should create DevLogger for unknown format', () => {
      // @ts-ignore - testing invalid format
      const logger = createLogger('unknown');
      expect(logger).toBeInstanceOf(DevLogger);
    });
  });

  describe('getLogFormatFromEnv', () => {
    it('should return "dev" when LOG_FORMAT is not set', () => {
      delete process.env.LOG_FORMAT;
      expect(getLogFormatFromEnv()).toBe('dev');
    });

    it('should return "dev" when LOG_FORMAT is empty string', () => {
      process.env.LOG_FORMAT = '';
      expect(getLogFormatFromEnv()).toBe('dev');
    });

    it('should return "json" when LOG_FORMAT=json', () => {
      process.env.LOG_FORMAT = 'json';
      expect(getLogFormatFromEnv()).toBe('json');
    });

    it('should return "tskv" when LOG_FORMAT=tskv', () => {
      process.env.LOG_FORMAT = 'tskv';
      expect(getLogFormatFromEnv()).toBe('tskv');
    });

    it('should be case insensitive', () => {
      process.env.LOG_FORMAT = 'JSON';
      expect(getLogFormatFromEnv()).toBe('json');
      
      process.env.LOG_FORMAT = 'TSKV';
      expect(getLogFormatFromEnv()).toBe('tskv');
      
      process.env.LOG_FORMAT = 'DEV';
      expect(getLogFormatFromEnv()).toBe('dev');
    });

    it('should return "dev" for unknown format values', () => {
      process.env.LOG_FORMAT = 'xml';
      expect(getLogFormatFromEnv()).toBe('dev');
      
      process.env.LOG_FORMAT = 'csv';
      expect(getLogFormatFromEnv()).toBe('dev');
    });
  });
});