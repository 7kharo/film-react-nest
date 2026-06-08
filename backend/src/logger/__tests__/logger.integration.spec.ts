import { DevLogger } from '../dev.logger';
import { JsonLogger } from '../json.logger';
import { TskvLogger } from '../tskv.logger';

describe('Logger Integration', () => {
  let consoleSpies: jest.SpyInstance[];

  beforeEach(() => {
    consoleSpies = [
      jest.spyOn(console, 'log').mockImplementation(),
      jest.spyOn(console, 'error').mockImplementation(),
      jest.spyOn(console, 'warn').mockImplementation(),
      jest.spyOn(console, 'debug').mockImplementation(),
    ];
  });

  afterEach(() => {
    consoleSpies.forEach(spy => spy.mockRestore());
  });

  it('DevLogger should output human-readable format', () => {
    const logger = new DevLogger();
    logger.log('Test message', 'FilmsService');
    
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('Test message');
    expect(output).toContain('FilmsService');
    // Не должно быть JSON или TSKV
    expect(output).not.toMatch(/^{.*}$/);
    expect(output).not.toContain('\t');
  });

  it('JsonLogger should output valid JSON', () => {
    const logger = new JsonLogger();
    logger.log('Test message', 'FilmsService');
    
    const output = console.log.mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
    const parsed = JSON.parse(output);
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('Test message');
    expect(parsed.context).toBe('FilmsService');
  });

  it('TskvLogger should output TSKV format', () => {
    const logger = new TskvLogger();
    logger.log('Test message', 'FilmsService');
    
    const output = console.log.mock.calls[0][0];
    expect(output).toMatch(/level=log\t/);
    expect(output).toMatch(/message=Test message\t/);
    expect(output).toMatch(/context=FilmsService$/);
    expect(output.split('\t')).toHaveLength(4);
  });
});