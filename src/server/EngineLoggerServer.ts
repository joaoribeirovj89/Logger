import net from 'net';
import path from 'path';
import { ConfigConnection } from '../shared/ConfigConnection';
import { FileLogger } from '../shared/FileLogger';
import { TerminalLogger } from '../shared/TerminalLogger';

export class EngineLoggerServer {
	server: net.Server;
	fileLogger: FileLogger;
	private terminalLogger: TerminalLogger;
	private pendingLogs: any[] = [];
	private flushInterval: NodeJS.Timeout | null = null;
	private index: number = 0;

	constructor() {
		this.terminalLogger = new TerminalLogger();
		this.fileLogger = new FileLogger(path.resolve(process.cwd(), 'logs'));
		this.server = net.createServer();
		this.addSocketListeners();
	}
	
	private addSocketListeners() {
		this.server.on('connection', (socket) => {
			this.terminalLogger.info(new Date(), 'EngineLoggerServer', 'Application connected');

			let buffer = '';
			socket.on('data', (data) => {
				buffer += data.toString();
				let lines = buffer.split('\n');
				buffer = lines.pop() || '';
				for (const line of lines) {
					if (line.trim() === '') continue;
					try {
						const log = JSON.parse(line);
						this.pendingLogs.push(log);
					} catch (error) {
						this.terminalLogger.error(new Date(), 'EngineLoggerServer', 'Error parsing log line: ' + String(error));
					}
				}
			});
			socket.on('end', () => {
				this.terminalLogger.info(new Date(), 'EngineLoggerServer', 'Client disconnected');
			});
		});
	}
	
	public startServer(config: ConfigConnection) {
		this.server.listen(config.port, config.host, () => {
			this.terminalLogger.info(new Date(), 'EngineLoggerServer', `EngineLoggerServer listening on ${config.host}:${config.port}`);
		});
		if (!this.flushInterval) {
			this.flushInterval = setInterval(() => this.flushLogs(), 1000); // flush every second
		}
	}

	private flushLogs() {
		if (this.pendingLogs.length === 0) return;
		let localListLogs = [...this.pendingLogs];
		this.pendingLogs = [];
		// Sort logs by Date
		localListLogs.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
		for (const log of localListLogs) {
			this.fileLogger.writeLog(this.index++, new Date(log.Date), log.Level, log.Application, log.Context, log.Message);
		}
	}
}