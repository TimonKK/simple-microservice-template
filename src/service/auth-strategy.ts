import { inject, injectable } from 'inversify';
import {UniqueTokenStrategy} from 'passport-unique-token';

import { IAuthStrategy, IExternalApi, ILogger } from '../ioc/interface';
import { TYPES } from '../ioc/type';

@injectable()
export class AuthStrategy implements IAuthStrategy {
    private api: IExternalApi;
    private logger: ILogger;

    constructor(
        @inject(TYPES.ExternalApi) api: IExternalApi,
        @inject(TYPES.Logger) logger: ILogger
    ) {
        this.api = api;
        this.logger = logger;
    }

    getStrategy() {
        return new UniqueTokenStrategy(
            {
                tokenHeader: 'X-Flomni-API'
            },
            (token, done) => {
                this.api.get('company.checkAPIToken', {token})
                    .then((user: object) => {
                        if (!user) {
                            return done(null, false);
                        }

                        return done(null, user);
                    }, done);
                }  
        );
    }
}