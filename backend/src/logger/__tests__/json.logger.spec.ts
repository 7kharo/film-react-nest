import { JsonLogger } from '../json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should produce valid JSON', () => {
      const result = logger.formatMessage('log', 'Test message');
      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('Test message');
    });

    it('should include timestamp', () => {
      const result = logger.formatMessage('log', 'Test');
      const parsed = JSON.parse(result);
      expect(parsed.timestamp).toBeDefined();
    });

    it('should stringify object messages', () => {
      const obj = { foo: 'bar' };
      const result = logger.formatMessage('log', obj);
      const parsed = JSON.parse(result);
      expect(parsed.message).toBe(JSON.stringify(obj));
    });

    it('should include context and stack when provided', () => {
      const result = logger.formatMessage('error', 'Error', 'OrderService', 'stack trace');
      const parsed = JSON.parse(result);
      expect(parsed.context).toBe('OrderService');
      expect(parsed.stack).toBe('stack trace');
    });
  });

  describe('log methods', () => {
    it('should output JSON for log level', () => {
      logger.log('Info');
      const output = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
      expect(JSON.parse(output).level).toBe('log');
    });
  });
});