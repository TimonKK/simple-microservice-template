import { Request, Response } from 'express';

export function allowCorsMiddleware(req: Request, res: Response, next: (error?: unknown) => void) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Flomni-API');
    res.header('Access-Control-Allow-Methods', 'GET,POST, OPTIONS, PUT, PATCH, DELETE');

    if (req.method !== 'OPTIONS') {
       return next();
    }

    res.send(200);
}