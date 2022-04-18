import { injectable } from 'inversify';
import winston from 'winston';

import { ILogger } from '../ioc/interface';

@injectable()
export class Logger implements ILogger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            // TODO Change for transports.Console to "[api] message"
            defaultMeta: { service: 'api' },
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                })
            ],
        });
    }

    info(message: string) {
        this.logger.info(message);
    }

    error(error: Error | string) {
        let serializedError = '';

        if (error instanceof Error) {
            serializedError = error.toString();
        } else {
            serializedError = error.toString();
        }

        this.logger.log({
            level: 'error',
            message: serializedError
        });
    }
}