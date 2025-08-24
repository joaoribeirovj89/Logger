
import { EngineLoggerServer } from './server/EngineLoggerServer';
import { EngineLoggerClient } from './client/EngineLoggerClient';
import { Logger } from './Logger';
import { ConfigConnection } from './shared/ConfigConnection';


// --- Server Setup ---
const serverConfig: ConfigConnection = { port: 5050, host: '127.0.0.1' };
const server = new EngineLoggerServer();
server.startServer(serverConfig);

// --- Client Setup ---
const clientConfig: ConfigConnection = { port: 5050, host: '127.0.0.1' };
EngineLoggerClient.InitClientInstance(clientConfig, 'SampleApp');

// --- Logger Usage ---
const logger = new Logger('SampleContext');
logger.info('Sample application started');
logger.warn('This is a warning');
logger.error('This is an error');
logger.debug('Debugging information');

// --- Multiple Logger Contexts ---
const userLogger = new Logger('UserModule');
userLogger.info('User created');

const paymentLogger = new Logger('PaymentModule');
paymentLogger.error('Payment failed');
