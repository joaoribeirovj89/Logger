import fs from 'fs';
import path from 'path';
import { FileLogger } from '../src/shared/FileLogger';

describe('FileLogger', () => {
	const testDir = path.join(__dirname, 'test-logs');
	let logger: FileLogger;

	beforeEach(() => {
		// Remove test directory if exists
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
		logger = new FileLogger(testDir);
	});

	afterEach(() => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
	});

	it('should create log directory if not exists', () => {
		expect(fs.existsSync(testDir)).toBe(true);
	});

	it('should write a log line to the file', () => {
		logger.writeLog(1, new Date('2025-08-24T12:00:00Z'), 'INFO', 'TestApp', 'TestContext', 'Test message');
		const logFile = fs.readdirSync(testDir)[0];
		const logPath = path.join(testDir, logFile);
		const content = fs.readFileSync(logPath, 'utf8');
		expect(content).toContain('Test message');
		expect(content).toContain('TestContext');
		expect(content).toContain('TestApp');
	});
});
