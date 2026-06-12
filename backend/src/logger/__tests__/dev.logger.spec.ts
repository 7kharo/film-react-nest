import { DevLogger } from '../dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('should not throw when calling log', () => {
    expect(() => logger.log('Test message')).not.toThrow();
  });

  it('should not throw when calling error', () => {
    expect(() => logger.error('Error message')).not.toThrow();
  });

  it('should not throw when calling warn', () => {
    expect(() => logger.warn('Warning message')).not.toThrow();
  });

  it('should not throw when calling debug', () => {
    expect(() => logger.debug('Debug message')).not.toThrow();
  });
});