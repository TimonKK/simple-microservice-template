import { Container } from 'inversify';
import 'reflect-metadata';
import NATS from 'tasu';

import { IAuthStrategy, IConfig, IExternalApi, ILogger, IRecipientService, IRequest, IServer } from './interface';
import { TYPES } from './type';
import { Logger } from '../lib/logger';
import { RecipientSevice } from '../service/recipient';
import { ExternalApi } from '../service/external-api';
import { Server } from '../server';
import { config } from '../config';
import { AuthStrategy } from '../service/auth-strategy';

const container = new Container();

container.bind<IConfig>(TYPES.Config).toConstantValue(config);
container.bind<ILogger>(TYPES.Logger).to(Logger);
container.bind<IRequest>(TYPES.Request).toConstantValue(new NATS(config.nats));
container.bind<IExternalApi>(TYPES.ExternalApi).to(ExternalApi);
container.bind<IAuthStrategy>(TYPES.AuthStrategy).to(AuthStrategy);
container.bind<IRecipientService>(TYPES.RecipientSevice).to(RecipientSevice);
container.bind<IServer>(TYPES.Server).to(Server);

export { container };