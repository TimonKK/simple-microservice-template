declare module 'tasu' {
    import { IConfigNATS } from './interface';

    export default class tasu {
        constructor(config: IConfigNATS);
        request<T extends object>(subject: string, message?: object): Promise<T>;
    }
}