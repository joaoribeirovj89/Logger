import { EngineLoggerServer } from '../src/server/EngineLoggerServer';

jest.mock('../src/shared/FileLogger', () => {
  return {
    FileLogger: jest.fn().mockImplementation(() => ({
      getLogFileName: jest.fn(() => 'mock.log'),
      log: jest.fn(),
    })),
  };
});

describe('EngineLoggerServer', () => {
  it('should create an instance and initialize FileLogger', () => {
    const server = new EngineLoggerServer();
    expect(server.fileLogger).toBeDefined();
    expect(server.server).toBeDefined();
  });
});
