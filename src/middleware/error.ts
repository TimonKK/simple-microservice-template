import { Request, Response } from 'express';

import { ILogger } from '../ioc/interface';
import { ValidationError, IResponseError, ApiError } from '../lib/error';

export function getErrorMiddleware(logger: ILogger) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (error: unknown, req: Request, res: Response, next: () => void) {
        if (error instanceof Error) {
            logger.error(error);

            const objError: IResponseError = {
                status: 500,
                message: error.message
            };
        
            if (error instanceof ValidationError) {
                const messages = [];
                for (const field of Object.keys(error.errors)) {
                    messages.push(error.errors[field].message);
                }
                objError.status = 417;
                objError.message =  messages.join('\n');
            } else if (error instanceof ApiError) {
                objError.status = error.status;
            }

            logger.error(error);
    
            return res.status(objError.status).json(objError);
        }

        logger.error(String(error));

        res.status(500);
    }
}