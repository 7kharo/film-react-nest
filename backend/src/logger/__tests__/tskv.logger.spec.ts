import { TskvLogger } from '../tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('escapeValue', () => {
    it('should escape newlines, carriage returns, and tabs', () => {
      // @ts-ignore
      expect(logger.escapeValue('line1\nline2')).toBe('line1 line2');
      // @ts-ignore
      expect(logger.escapeValue('col1\tcol2')).toBe('col1 col2');
      // @ts-ignore
      expect(logger.escapeValue('text\r\nwith\r\nnewlines')).toBe('text with newlines');
    });

    it('should collapse multiple whitespace', () => {
      // @ts-ignore
      expect(logger.escapeValue('many    spaces')).toBe('many spaces');
      // @ts-ignore
      expect(logger.escapeValue('  leading and trailing  ')).toBe('leading and trailing');
    });

    it('should return empty string for null or undefined', () => {
      // @ts-ignore
      expect(logger.escapeValue(null)).toBe('');
      // @ts-ignore
      expect(logger.escapeValue(undefined)).toBe('');
    });

    it('should convert non-strings to string', () => {
      // @ts-ignore
      expect(logger.escapeValue(123)).toBe('123');
      // @ts-ignore
      expect(logger.escapeValue({ foo: 'bar' })).toBe('{"foo":"bar"}');
    });
  });

  describe('formatMessage', () => {
    it('should format simple log message as TSKV', () => {
      // @ts-ignore
      const result = logger.formatMessage('log', 'Test message', 'FilmsService');
      
      expect(result).toMatch(/level=log\t/);
      expect(result).toMatch(/timestamp=\d{4}-\d{2}-\d{2}T/);
      expect(result).toMatch(/message=Test message\t/);
      expect(result).toMatch(/context=FilmsService$/);
      expect(result.split('\t')).toHaveLength(4);
    });

    it('should include stack trace when provided', () => {
      const errorStack = 'Error: Something went wrong\n    at FilmsService.getFilms';
      // @ts-ignore
      const result = logger.formatMessage('error', 'Error message', 'OrderService', errorStack);
      
      expect(result).toContain('stack=');
      expect(result.split('\t')).toHaveLength(5);
    });

    it('should handle message as object', () => {
      const objMessage = { user: 'test', action: 'buy' };
      // @ts-ignore
      const result = logger.formatMessage('log', objMessage, 'FilmsService');
      
      expect(result).toContain(`message=${JSON.stringify(objMessage)}`);
    });

    it('should use tab separators between fields', () => {
      // @ts-ignore
      const result = logger.formatMessage('log', 'Test', 'FilmsService');
      expect(result).toContain('\t');
      const fields = result.split('\t');
      expect(fields.length).toBeGreaterThan(1);
      fields.forEach(field => {
        expect(field).toMatch(/^[a-z]+=.+$/);
      });
    });
  });

  describe('log methods', () => {
    it('should output TSKV string for log level', () => {
      logger.log('Info message', 'FilmsService');
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      expect(output).toMatch(/level=log\t/);
      expect(output).toMatch(/message=Info message/);
    });

    it('should output TSKV string for error level', () => {
      logger.error('Error message', 'OrderService');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toMatch(/level=error\t/);
      expect(output).toMatch(/message=Error message/);
    });

    it('should output TSKV string for warn level', () => {
      logger.warn('Warning message', 'AuthService');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0][0];
      expect(output).toMatch(/level=warn\t/);
      expect(output).toMatch(/message=Warning message/);
    });

    it('should output TSKV string for debug level', () => {
      logger.debug('Debug message', 'FilmsService');
      
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const output = consoleDebugSpy.mock.calls[0][0];
      expect(output).toMatch(/level=debug\t/);
      expect(output).toMatch(/message=Debug message/);
    });

    it('should output TSKV string for verbose level', () => {
      logger.verbose('Verbose message', 'FilmsService');
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      expect(output).toMatch(/level=verbose\t/);
      expect(output).toMatch(/message=Verbose message/);
    });
  });
});