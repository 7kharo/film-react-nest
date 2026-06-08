import { JsonLogger } from '../json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should format simple log message as JSON', () => {
      // @ts-ignore - testing private method
      const result = logger.formatMessage('log', 'Test message', 'FilmsService');
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        level: 'log',
        timestamp: expect.any(String),
        message: 'Test message',
        context: 'FilmsService',
        stack: null,
      });
      expect(() => new Date(parsed.timestamp)).not.toThrow();
      expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should format error with stack trace', () => {
      const error = new Error('Something went wrong');
      // @ts-ignore
      const result = logger.formatMessage('error', error.message, 'OrderService', error.stack);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        level: 'error',
        timestamp: expect.any(String),
        message: 'Something went wrong',
        context: 'OrderService',
        stack: error.stack,
      });
    });

    it('should stringify object messages', () => {
      const objMessage = { user: 'test', action: 'login' };
      // @ts-ignore
      const result = logger.formatMessage('log', objMessage, 'AuthService');
      const parsed = JSON.parse(result);
      
      expect(parsed.message).toBe(JSON.stringify(objMessage));
    });

    it('should add extra parameters when provided', () => {
      // @ts-ignore
      const result = logger.formatMessage('log', 'Test', 'FilmsService', null, { extra1: 'value1' }, { extra2: 'value2' });
      const parsed = JSON.parse(result);
      
      expect(parsed.extra).toEqual([{ extra1: 'value1' }, { extra2: 'value2' }]);
    });
  });

  describe('log methods', () => {
    it('should output JSON string for log level', () => {
      logger.log('Info message', 'FilmsService');
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
      expect(JSON.parse(output).level).toBe('log');
    });

    it('should output JSON string for error level', () => {
      logger.error('Error message', 'OrderService');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
      expect(JSON.parse(output).level).toBe('error');
    });

    it('should output JSON string for warn level', () => {
      logger.warn('Warning message', 'AuthService');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
      expect(JSON.parse(output).level).toBe('warn');
    });

    it('should output JSON string for debug level', () => {
      logger.debug('Debug message', 'FilmsService');
      
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const output = consoleDebugSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
      expect(JSON.parse(output).level).toBe('debug');
    });

    it('should output JSON string for verbose level', () => {
      logger.verbose('Verbose message', 'FilmsService');
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
      expect(JSON.parse(output).level).toBe('verbose');
    });
  });
});