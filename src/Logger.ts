import { EngineLoggerClient } from './client/EngineLoggerClient';

export class Logger {
	private engine: EngineLoggerClient;

	constructor(private context: string) {
		this.engine = EngineLoggerClient.GetInstance();
		if (!this.engine) {
			throw new Error('EngineLoggerClient is not initialized');
		}
	}

	private validateMessage(msg: string) {
		if (!msg || typeof msg !== 'string' || msg.trim() === '') {
			throw new Error('Log message must be a non-empty string');
		}
	}

	public info(msg: string) {
		this.validateMessage(msg);
		this.engine.info(this.context, msg);
	}

	public error(msg: string) {
		this.validateMessage(msg);
		this.engine.error(this.context, msg);
	}

	public warn(msg: string) {
		this.validateMessage(msg);
		this.engine.warn(this.context, msg);
	}

	public debug(msg: string) {
		this.validateMessage(msg);
		if (process.env.NODE_ENV !== 'production') {
			this.engine.debug(this.context, msg);
		}
	}
}
