import { Request, Response, NextFunction} from "express"
import { ZodError } from "zod" 
import { AppError } from "../errors/app-error";

export function errorHandling(error:any, request: Request, response: Response, _: NextFunction ){
    if(error instanceof ZodError){
        return response.status(400).json({message: "validation error", issues: error.format()})
    }
    if(error instanceof AppError){
        return response.status(error.statusCode).json({ message: error.message})
    }
    return response.status(500).json({ message: error.message })
}