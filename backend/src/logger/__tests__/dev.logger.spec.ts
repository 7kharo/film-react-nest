import { DevLogger } from '../dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new DevLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatPid', () => {
    it('should format PID correctly', () => {
      // @ts-ignore - testing protected method
      const result = logger.formatPid(12345);
      expect(result).toBe('[Nest] 12345  - ');
    });
  });

  describe('formatContext', () => {
    it('should format context with brackets when provided', () => {
      // @ts-ignore - testing protected method
      const result = logger.formatContext('FilmsService');
      expect(result).toBe('[FilmsService] ');
    });

    it('should return empty string when context is not provided', () => {
      // @ts-ignore - testing protected method
      const result = logger.formatContext('');
      expect(result).toBe('');
    });
  });

  describe('log methods', () => {
    it('should call console.log with formatted message', () => {
      logger.log('Test message', 'FilmsService');
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      );
    });

    it('should call console.error for error logs', () => {
      logger.error('Error message', 'OrderService');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error message')
      );
    });

    it('should call console.warn for warn logs', () => {
      logger.warn('Warning message', 'AuthService');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning message')
      );
    });

    it('should call console.debug for debug logs', () => {
      logger.debug('Debug message', 'FilmsService');
      
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining('Debug message')
      );
    });

    it('should handle messages without context', () => {
      logger.log('Message without context');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Message without context')
      );
    });
  });
});