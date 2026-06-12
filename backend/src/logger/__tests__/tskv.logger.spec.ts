import { TskvLogger } from '../tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('escapeValue', () => {
    it('should escape newlines, tabs, carriage returns', () => {
      expect(logger.escapeValue('line1\nline2')).toBe('line1 line2');
      expect(logger.escapeValue('col1\tcol2')).toBe('col1 col2');
      expect(logger.escapeValue('text\r\nwith\r\nnewlines')).toBe(
        'text with newlines',
      );
    });

    it('should collapse multiple spaces', () => {
      expect(logger.escapeValue('many    spaces')).toBe('many spaces');
    });

    it('should return empty string for null/undefined', () => {
      expect(logger.escapeValue(null)).toBe('');
      expect(logger.escapeValue(undefined)).toBe('');
    });

    it('should convert non-strings to string', () => {
      expect(logger.escapeValue(123)).toBe('123');
      expect(logger.escapeValue({ foo: 'bar' })).toBe('{"foo":"bar"}');
    });
  });

  describe('formatMessage', () => {
    it('should produce TSKV format', () => {
      const result = logger.formatMessage('log', 'Test message');
      expect(result).toMatch(/level=log\t/);
      expect(result).toMatch(/timestamp=\d{4}-\d{2}-\d{2}T/);
      expect(result).toContain('message=Test message');
    });

    it('should include context when provided', () => {
      const result = logger.formatMessage('log', 'Test', 'FilmsService');
      expect(result).toContain('context=FilmsService');
    });

    it('should use tab separators', () => {
      const result = logger.formatMessage('log', 'Test');
      expect(result).toContain('\t');
      const fields = result.split('\t');
      expect(fields.length).toBeGreaterThan(1);
    });
  });
});
