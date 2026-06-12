import { DevLogger } from '../dev.logger';
import { JsonLogger } from '../json.logger';
import { TskvLogger } from '../tskv.logger';

describe('Logger Integration', () => {
  let consoleLogSpy: jest.SpyInstance;
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('DevLogger should output something', () => {
    const logger = new DevLogger();
    logger.log('Test');
    expect(stdoutSpy).toHaveBeenCalled();
  });

  it('JsonLogger should output valid JSON', () => {
    const logger = new JsonLogger();
    logger.log('Test');
    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0] as string;
    expect(output.trim().startsWith('{')).toBe(true);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('TskvLogger should output TSKV format', () => {
    const logger = new TskvLogger();
    logger.log('Test');
    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0] as string;
    expect(output).toContain('level=log\t');
    expect(output).toContain('message=Test');
  });
});