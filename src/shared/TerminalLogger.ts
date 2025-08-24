export class TerminalLogger {
	private formatLog(date: Date, level: string, colorLevel: string, context: string, logLine: string) {
		const reset = '\x1b[0m';
		return `${colorLevel}[${level}]${reset}: ${date.toISOString().split('T')[0]} | ${date.getTime()} | ${context}` + ` | ${logLine}`;
	}

	public info(date: Date, context: string, msg: string) {
		const formatted = this.formatLog(date, 'INFO', '\x1b[36m', context, msg);
		console.info(formatted);
	}

	public error(date: Date, context: string, msg: string) {
		const formatted = this.formatLog(date, 'ERROR', '\x1b[31m', context, msg);
		console.error(formatted);
	}

	public warn(date: Date, context: string, msg: string) {
		const formatted = this.formatLog(date, 'WARN', '\x1b[33m', context, msg);
		console.warn(formatted);
	}

	public debug(date: Date, context: string, msg: string) {
		const formatted = this.formatLog(date, 'DEBUG', '\x1b[32m', context, msg);
		if (process.env.NODE_ENV !== 'production') {
			console.debug(formatted);
		}
	}
}
