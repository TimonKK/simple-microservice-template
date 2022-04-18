import { Router, Request, Response } from 'express';
import _ from 'lodash';

import { IRecipientService, IUser } from '../ioc/interface';
import asyncWrapper from '../lib/async-wrapper';
import { ApiError } from '../lib/error';

export function getRecipientRouter(recipientService: IRecipientService): Router {
    const router = Router();

    router.get('/', asyncWrapper(async (req: Request, res: Response) => {
        // TODO Add DTO for this params
        const uid = req.query.uid;
        const user = req['user'] as IUser;

        const { count, recipients: [recipient] } = await recipientService.getRecepies(<string>uid, user.id);

        if (count < 1) {
            throw new ApiError('Recipient not found', 404);
        }

        res.status(200).json({
            uid,
            profile: recipient.uProfile,
            ..._.pick(recipient, ['metaData','tags','messengers','transactions'])
        });
    }));

    return router;
}