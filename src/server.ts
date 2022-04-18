import express from 'express';
import { inject, injectable } from 'inversify';
import http from 'http';
import bodyParser from 'body-parser';
import passport from 'passport';

import {getRecipientRouter} from './controller/recipient';
import {getHealthCheckRouter} from './controller/health-check';
import { IAuthStrategy, IConfig, ILogger, IRecipientService, IServer } from './ioc/interface';
import { TYPES } from './ioc/type';
import { getErrorMiddleware, allowCorsMiddleware } from './middleware';

@injectable()
export class Server implements IServer {
    private config: IConfig;
    private instance: http.Server | undefined;
    private recipientSevice: IRecipientService;
    private authStrategy: IAuthStrategy;
    private logger: ILogger;

    constructor(
        @inject(TYPES.Config) config: IConfig,
        @inject(TYPES.RecipientSevice) recipientSevice: IRecipientService,
        @inject(TYPES.AuthStrategy) authStrategy: IAuthStrategy,
        @inject(TYPES.Logger) logger: ILogger
    ) {
        this.config = config;
        this.recipientSevice = recipientSevice;
        this.authStrategy = authStrategy;
        this.logger = logger;
    }

    getAppInstance(): http.Server {
        if (!this.instance) {
            throw new Error('Before Server.getAppInstance call the method "start" must be called first!');
        }

        return this.instance;
    }

    async start() {
        const app = express();

        passport.use(this.authStrategy.getStrategy());

        app.use(allowCorsMiddleware);
        app.use(bodyParser.json());
        app.use(passport.initialize());

        // api
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        app.use('/recipients', passport.authenticate('token', {session: false}), getRecipientRouter(this.recipientSevice));
        app.use('/health-check', getHealthCheckRouter());
        app.use(getErrorMiddleware(this.logger));

        // TODO Think about reasone why Server knows all config but not only config.http scope
        this.instance = await new Promise(resolve => {
            const instance = app.listen(this.config.http.port, () => {
                this.logger.info(`Started listening ${this.config.http.port} port for "${this.config.envName}" env`);

                resolve(instance);
            });
        });
    }

    async destroy() {
        await new Promise(resolve => this.instance?.close(resolve));
    }
}
