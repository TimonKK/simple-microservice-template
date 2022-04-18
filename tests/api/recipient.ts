import supertest from 'supertest';
import sinon from 'sinon';

import { IRequest, IServer } from '../../src/ioc/interface';
import { getDefaultTestContext } from '../util';

describe('GET /recipient', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: IServer;
    let sandbox: sinon.SinonSandbox;
    let natStub: sinon.SinonStub;

    
    async function getMocks() {
        const nats = {
            request: (url: string, params?: object): Promise<object> => {
                return Promise.resolve({});
            }
        };

        natStub = sandbox.stub(nats, 'request');

    
        const context = await getDefaultTestContext(nats as unknown as IRequest);
        server = context.server;
        request = supertest(context.app);
    
        return {
            request,
            natStub
        };
    }

    const token = '123';

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(async() => {
        sandbox.reset();

        if (server) {
            await server.destroy();
        }
    });

    test('should reponse 400 for request without token', async () => {
        const {request} = await getMocks();

        await request.get('/recipients')
            .expect(400);
    });

    test('should reponse 404 for if NATS returns empty recipient list', async () => {
        const natReponseBody = {
            count: 0,
            recipients: []
        };

        const {natStub, request} = await getMocks();

        natStub
            .withArgs('company.checkAPIToken').returns(Promise.resolve({id:1}))
            .withArgs('recipient.requestMulti').returns(Promise.resolve(natReponseBody));

        const res = await request.get('/recipients')
            .set('X-Flomni-API', token)
            .expect(404);

        expect(res.body).toEqual({
            "message": "Recipient not found",
            "status": 404
        });
    });

    test('should reponse 200 for if NATS returns non-empty recipient list', async () => {
        const uid = '1';
        const natReponseBody = {
            count: 2,
            recipients: [
                {
                    id: 1,
                    uProfile: {},
                    metaData: {},
                    tags: [],
                    messengers: [],
                    transactions: []
                },

                {
                    id: 2
                }
            ]
        };

        const {natStub, request} = await getMocks();

        natStub
            .withArgs('company.checkAPIToken').returns(Promise.resolve({id:1}))
            .withArgs('recipient.requestMulti').returns(Promise.resolve(natReponseBody));

        const res = await request.get(`/recipients?uid=${uid}`)
            .set('X-Flomni-API', token)
            .expect(200);

        expect(res.body).toEqual({
            uid: uid,
            profile: natReponseBody.recipients[0].uProfile,
            metaData: natReponseBody.recipients[0].metaData,
            tags: natReponseBody.recipients[0].tags,
            messengers: natReponseBody.recipients[0].messengers,
            transactions: natReponseBody.recipients[0].transactions
        });
    });
});