import { inject, injectable } from 'inversify';

import { IExternalApi, IRecipeResponse, IRecipientService } from '../ioc/interface';
import { TYPES } from '../ioc/type';

@injectable()
export class RecipientSevice implements IRecipientService {
    private api: IExternalApi;

    constructor(
        @inject(TYPES.ExternalApi) api: IExternalApi
    ) {
        this.api = api;
    }

    async getRecepies(uid: string, ownerId: number): Promise<IRecipeResponse> {
        const data = await this.api.get<IRecipeResponse>('recipient.requestMulti', {userHash: uid, ownerId});

        return data;
    }
}