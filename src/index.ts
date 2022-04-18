import { container } from './ioc/inversify.config';
import { ILogger, IServer } from './ioc/interface';
import { TYPES } from './ioc/type';

const server = container.get<IServer>(TYPES.Server);
const logger = container.get<ILogger>(TYPES.Logger);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('unhandledRejection', shutDown);
process.on('uncaughtException', shutDown);

function shutDown(error: Error) {
   logger.error(error);

   if (server) {
      void server.destroy();
   }

   setTimeout(() => process.exit(1), 1000);
}

void server.start();
