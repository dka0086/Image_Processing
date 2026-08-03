import { AppError } from "./app-error"

export class NotFoundError extends AppError{
    constructor(errorMessage: string){
        super(errorMessage, 404) 
    }
}