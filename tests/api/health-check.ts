import supertest from 'supertest';

import { IServer } from '../../src/ioc/interface';
import { getDefaultTestContext } from '../util';

describe('GET /recipient', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: IServer;

    beforeEach(async () => {
        const context = await getDefaultTestContext();
        server = context.server;
        request = supertest(context.app);
    });

    afterEach(async() => {
        if (server) {
            await server.destroy();
        }
    });

    test('should reponse 200 status and expected message', () => {
        request.get(
            '/health-check'
        )
            .expect(200)
    });
});