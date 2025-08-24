import { EngineLoggerClient } from '../src/client/EngineLoggerClient';

jest.mock('net', () => ({
  createConnection: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
  })),
}));

// Mock TerminalLogger to avoid console output and focus on EngineLoggerClient logic
jest.mock('../src/shared/TerminalLogger', () => {
  return {
    TerminalLogger: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      log: jest.fn(),
    })),
  };
});

describe('EngineLoggerClient', () => {
  it('should create an instance and connect', () => {
    const client = EngineLoggerClient.GetInstance();
    expect(client).toBeDefined();
    // appName is private, so we don't test it directly
  });

  it('should call info, error, warn, debug without throwing', () => {
    const client = EngineLoggerClient.GetInstance();
    expect(() => client.info('TestContext', 'Info message')).not.toThrow();
    expect(() => client.error('TestContext', 'Error message')).not.toThrow();
    expect(() => client.warn('TestContext', 'Warn message')).not.toThrow();
    expect(() => client.debug('TestContext', 'Debug message')).not.toThrow();
  });
});
