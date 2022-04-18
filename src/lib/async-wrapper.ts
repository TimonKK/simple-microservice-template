import { Request, Response } from 'express';

import { IRequestWithUser } from '../ioc/interface';

interface IAsyncRequestHandler {
    (req: Request, res: Response): Promise<void>;
}

export default function(callback: IAsyncRequestHandler) {
    return (req: Request | IRequestWithUser, res: Response, next: (error?: unknown) => void) => {
        callback(req, res)
            .then(
                () => next(),
                next
            );
    }
}