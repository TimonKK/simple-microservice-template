import { inject, injectable } from 'inversify';

import { IExternalApi, ILogger, IRequest } from '../ioc/interface';
import { TYPES } from '../ioc/type';

@injectable()
export class ExternalApi implements IExternalApi {
    private request: IRequest;
    private logger: ILogger;

    constructor(
        @inject(TYPES.Request) request: IRequest,
        @inject(TYPES.Logger) logger: ILogger
    ) {
        this.request = request;
        this.logger = logger;
    }

    async get<T extends object>(url: string, params: object): Promise<T> {
        this.logger.info(`Start request to "${url}"`);

        const res = await this.request.request(url, params) as T;

        return res;
    }
}