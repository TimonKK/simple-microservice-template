import { Request } from 'express';
import http from 'http';
import UniqueTokenStrategy from 'passport-unique-token';

import { IResponseError } from '../lib/error';

export interface ILogger {
    info(message: string): void;
    error(message: Error|IResponseError|string): void;
}

export interface IRequest {
    request(subject: string, message?: object): Promise<object>;
}

interface IConfigHttp {
    port: number;
}

export interface IConfigNATS {
    maxReconnectAttempts: number;
    reconnectTimeWait: number;
    requestTimeout: number;
    url: string;
    user?: string;
    pass?: string;
    group: string;
}

export interface IConfig {
    envName: string;
    http: IConfigHttp;
    nats: IConfigNATS;
}

export interface IExternalApi {
    get<T extends object>(url: string, params: object): Promise<T>;
}

interface IRecipe {
    uProfile: object;
    metaData: object;
    tags: object[];
    messengers: object[];
    transactions: object[];
}
export interface IRecipeResponse {
    count: number;
    recipients: IRecipe[];
}

export interface IRecipientService {
    getRecepies(uid: string, ownerId: number): Promise<IRecipeResponse>;
}

export interface IServer {
    getAppInstance(): http.Server;
    start(): Promise<void>;
    destroy(): Promise<void>;
}


export interface IAuthStrategy {
    getStrategy(): UniqueTokenStrategy;
}

export interface IRequestWithUser extends Request {
    user: object;
}

export interface IUser {
    id: number;
}