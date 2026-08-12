import { AppError } from "./app-error"

export class UnauthorizedError extends AppError{
    constructor(errorMessage: string){
        super(errorMessage, 401) 
    }
}