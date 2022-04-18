import mongoose from 'mongoose';

const ValidationError = mongoose.Error.ValidationError;

export { ValidationError };

export class ApiError extends Error {
    public name: string;
    public status: number;

    constructor(message: string, status = 500) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.status = status;
    }
}

export interface IResponseError {
    status: number;
    message: string;
}