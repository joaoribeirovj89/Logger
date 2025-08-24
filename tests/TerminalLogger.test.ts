import { TerminalLogger } from '../src/shared/TerminalLogger';

describe('TerminalLogger', () => {
	let terminalLogger: TerminalLogger;
	beforeEach(() => {
		terminalLogger = new TerminalLogger();
		jest.spyOn(console, 'info').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.spyOn(console, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should log info', () => {
		terminalLogger.info(new Date(), 'TestContext', 'Info message');
		expect(console.info).toHaveBeenCalled();
	});

	it('should log error', () => {
		terminalLogger.error(new Date(), 'TestContext', 'Error message');
		expect(console.error).toHaveBeenCalled();
	});

	it('should log warn', () => {
		terminalLogger.warn(new Date(), 'TestContext', 'Warn message');
		expect(console.warn).toHaveBeenCalled();
	});

	it('should log debug in development', () => {
		process.env.NODE_ENV = 'development';
		terminalLogger.debug(new Date(), 'TestContext', 'Debug message');
		expect(console.debug).toHaveBeenCalled();
	});

	it('should not log debug in production', () => {
		process.env.NODE_ENV = 'production';
		terminalLogger.debug(new Date(), 'TestContext', 'Debug message');
		expect(console.debug).not.toHaveBeenCalled();
	});
});
