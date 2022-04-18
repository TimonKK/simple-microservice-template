import { Router, Request, Response } from 'express';

export function getHealthCheckRouter(): Router {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
        res.json({ok: 1});
    });

    return router;
}