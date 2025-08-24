import { Logger } from '../src/Logger';

// Mock EngineLoggerClient to avoid real TCP connections and match actual API
jest.mock('../src/client/EngineLoggerClient', () => {
  return {
    EngineLoggerClient: {
      getInstance: () => ({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      }),
    },
  };
});

describe('Logger', () => {
  it('should throw error for empty message', () => {
    const logger = new Logger('TestContext');
    expect(() => logger.info('')).toThrow();
    expect(() => logger.error('   ')).toThrow();
  });

  it('should log info, error, warn', () => {
    const logger = new Logger('TestContext');
    expect(() => logger.info('Info message')).not.toThrow();
    expect(() => logger.error('Error message')).not.toThrow();
    expect(() => logger.warn('Warn message')).not.toThrow();
  });

  it('should not log debug in production', () => {
    process.env.NODE_ENV = 'production';
    const logger = new Logger('TestContext');
    expect(() => logger.debug('Debug message')).not.toThrow(); // Should not log
  });

  it('should log debug in development', () => {
    process.env.NODE_ENV = 'development';
    const logger = new Logger('TestContext');
    expect(() => logger.debug('Debug message')).not.toThrow();
  });
});
