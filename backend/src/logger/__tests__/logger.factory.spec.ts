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
    it('should create DevLogger for "dev"', () => {
      expect(createLogger('dev')).toBeInstanceOf(DevLogger);
    });

    it('should create JsonLogger for "json"', () => {
      expect(createLogger('json')).toBeInstanceOf(JsonLogger);
    });

    it('should create TskvLogger for "tskv"', () => {
      expect(createLogger('tskv')).toBeInstanceOf(TskvLogger);
    });

    it('should create DevLogger by default', () => {
      expect(createLogger()).toBeInstanceOf(DevLogger);
    });

    it('should create DevLogger for unknown format', () => {
      // @ts-ignore
      expect(createLogger('unknown')).toBeInstanceOf(DevLogger);
    });
  });

  describe('getLogFormatFromEnv', () => {
    it('should return "dev" when LOG_FORMAT is not set', () => {
      delete process.env.LOG_FORMAT;
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
    });

    it('should return "dev" for unknown values', () => {
      process.env.LOG_FORMAT = 'xml';
      expect(getLogFormatFromEnv()).toBe('dev');
    });
  });
});