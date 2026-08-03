export class AppError extends Error{
    public readonly statusCode: number
    constructor(errorMessage: string, statusCode: number){
        super(errorMessage) 
        this.name = this.constructor.name
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}