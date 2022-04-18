import { Container } from "inversify";
import "reflect-metadata";
import _ from 'lodash';

import { IAuthStrategy, IConfig, IExternalApi, ILogger, IRecipientService, IRequest, IServer } from "../src/ioc/interface";
import { TYPES } from "../src/ioc/type";
import { Server } from "../src/server";
import { ExternalApi } from "../src/service/external-api";
import { RecipientSevice } from "../src/service/recipient";
import { config } from "../src/config";
import { AuthStrategy } from "../src/service/auth-strategy";

export class FakeLogger implements ILogger {
    info(message: string) {
        console.log('FakeLogger.info', message)
    }
    error(message: any) {
        console.log('FakeLogger.error', message)
    }
}

export class FakeNATS implements IRequest {
    async request(subject: string, message?: object): Promise<object> {
        return {};
    }
}

// TODO Think about definition of dependies for container fabric method
export function containerInit(c: IConfig, logger: ILogger, nats: IRequest) {
    const container = new Container();

    container.bind<IConfig>(TYPES.Config).toConstantValue(_.merge({}, config, c));
    container.bind<ILogger>(TYPES.Logger).toConstantValue(logger);
    container.bind<IRequest>(TYPES.Request).toConstantValue(nats);
    container.bind<IExternalApi>(TYPES.ExternalApi).to(ExternalApi);
    container.bind<IAuthStrategy>(TYPES.AuthStrategy).to(AuthStrategy);
    container.bind<IRecipientService>(TYPES.RecipientSevice).to(RecipientSevice);
    container.bind<IServer>(TYPES.Server).to(Server);

    return container;
}

export async function getDefaultTestContext(request?: IRequest) {
    const container = containerInit(<IConfig>{
        envName: 'local-test',
        http: {
            port: 0
        },
        logger: {},
        nats: {
            maxReconnectAttempts: -1,
            reconnectTimeWait: 250,
            requestTimeout: 30000,
            url: 'http://localhost:4222',
            group: 'flomni-new'
        }
    }, new FakeLogger(), request || new FakeNATS());
    const server = container.get<IServer>(TYPES.Server);
    await server.start();

    return {server, app: server.getAppInstance()}
}