export class ConflictError extends Error{
    public readonly statusCode: number
    constructor(errorMessage: string, statusCode = 400){
        super(errorMessage) 
        this.name = this.constructor.name
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}