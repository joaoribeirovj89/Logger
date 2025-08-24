import fs from 'fs';
import path from 'path';

export class FileLogger {
	private logDir: string;
	constructor(logDir: string) {
		this.logDir = logDir;
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir, { recursive: true });
		}
	}

	private getLogFileName(): string {
		const date = new Date();
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, '0');
		const dd = String(date.getDate()).padStart(2, '0');
		return path.join(this.logDir, `${yyyy}-${mm}-${dd}.log`);
	}
	
	public writeLog(index: number, date: Date, level: string, app: string, context: string, message: string) {
		const logLine = `{"index":${index}, "Date":${date}, "Level":[${level}], "Application":"${app}", "Context":"${context}", "Message":"${message}"}`;
		fs.appendFileSync(this.getLogFileName(), logLine + '\n', { encoding: 'utf8' });
	}
}
