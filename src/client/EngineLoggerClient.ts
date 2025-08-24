import net from 'net';

import { ConfigConnection } from '../shared/ConfigConnection';
import { TerminalLogger } from '../shared/TerminalLogger';

export class EngineLoggerClient {
    private static instance: EngineLoggerClient;

	private appName: string;
    private client: net.Socket | undefined;
    private config: ConfigConnection | undefined;
    private logQueue: string[] = [];
    private terminalLogger: TerminalLogger;
    private queueInterval: NodeJS.Timeout | null = null;
    private reconnectIntervalId: NodeJS.Timeout | null = null;

    private constructor(config: ConfigConnection | undefined, appName: string) {
		this.appName = appName;
        this.config = config;
        this.terminalLogger = new TerminalLogger();
    }

	public static GetInstance(): EngineLoggerClient {
		if (!EngineLoggerClient.instance) {
			EngineLoggerClient.instance = new EngineLoggerClient(undefined, 'DefaultApp');
			EngineLoggerClient.instance.terminalLogger.warn(new Date(), 'EngineLoggerClient',
			'EngineLoggerClient is not initialized, all logs will not be sent to the server, please call InitClientInstance with proper configuration');
		}
        return EngineLoggerClient.instance;
    }

	public static InitClientInstance(config: ConfigConnection, appName: string) {
		if (!EngineLoggerClient.instance) {
			EngineLoggerClient.instance = new EngineLoggerClient(config, appName);
		} else if (EngineLoggerClient.instance.client) {
			EngineLoggerClient.instance.terminalLogger.warn(new Date(), 'EngineLoggerClient',
			'EngineLoggerClient is already connected to a server');
			return;
		} else {
			EngineLoggerClient.instance.config = config;
			EngineLoggerClient.instance.appName = appName;
        }
		EngineLoggerClient.instance.connect();
    }

	private connect() {
		if (!this.config) return;
		this.terminalLogger.info(new Date(), 'EngineLoggerClient', 'Trying to connect to EngineLoggerServer');
		this.client = net.createConnection({ port: this.config.port, host: this.config.host });
		this.addSocketListeners();
	}

	private reconnect() {
		if (!this.config) return;
		this.terminalLogger.warn(new Date(), 'EngineLoggerClient', 'Trying to reconnect to EngineLoggerServer');
		this.client?.connect(this.config.port, this.config.host);
	}

	private addSocketListeners() {
        this.client?.on('error', (err) => {
			if (this.reconnectIntervalId) return;
			this.terminalLogger.error(new Date(), 'EngineLoggerClient', 'Socket error: ' + String(err));
        });

        this.client?.on('close', () => {
			if (this.reconnectIntervalId == null) {
				this.terminalLogger.error(new Date(), 'EngineLoggerClient', 'Disconnected from EngineLoggerServer');
				this.reconnectIntervalId = setInterval(() => {
					this.reconnect();
				}, 1000);
            }
        });

        this.client?.on('connect', () => {
            this.terminalLogger.info(new Date(), 'EngineLoggerClient', 'Connected to EngineLoggerServer');
            if (this.reconnectIntervalId) {
                clearInterval(this.reconnectIntervalId);
                this.reconnectIntervalId = null;
            }
			if (!this.queueInterval) {
				this.queueInterval = setInterval(() => this.processQueue(), 1);
			}
        });
    }

    private pushLog(date: Date, level: string, context: string, message: string) {
		if (!this.client) return;
		const logObj: any = {
			Date: date,
            Level: level,
            Application: this.appName,
            Context: context,
            Message: message
        };
        try {
			const objectNotation = JSON.stringify(logObj ) + '\n';
            this.logQueue.push(objectNotation);
        } catch (error) {
			this.terminalLogger.error(date, context, String(error));
        }
    }
	
	public info(context: string, message: string) {
		const now = new Date();
		this.terminalLogger.info(now, context, message);
		this.pushLog(now, 'INFO', context, message);
	}

	public error(context: string, message: string) {
		const now = new Date();
		this.terminalLogger.error(now, context, message);
		this.pushLog(now, 'ERROR', context, message);
	}

	public warn(context: string, message: string) {
		const now = new Date();
		this.terminalLogger.warn(now, context, message);
		this.pushLog(now, 'WARN', context, message);
	}

	public debug(context: string, message: string) {
		const now = new Date();
		this.terminalLogger.debug(now, context, message);
		this.pushLog(now, 'DEBUG', context, message);
	}

    private processQueue() {
		if (this.logQueue.length === 0) return;
        if (this.client?.destroyed || !this.client?.writable || this.reconnectIntervalId) return;
        const logLine = this.logQueue.shift();
        if (!logLine) return;
        this.client.write(logLine, (err?: Error | null) => {
            if (err) {
                this.terminalLogger.error(new Date(), 'EngineLoggerClient', String(err));
                this.logQueue.unshift(logLine);
            }
        });
    }
}
