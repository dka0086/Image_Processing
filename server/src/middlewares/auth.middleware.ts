import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "../errors/unauthorized-error"
import jwt from "jsonwebtoken";


interface TokenPayload {
    userId: string;
    email: string;
}
export const requireAuth = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token
        if(token==null){
            throw new UnauthorizedError("Token ausente")
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
        req.userId = payload.userId
        next()
    }catch(err){
        next(new UnauthorizedError("Token inválido ou expirado"))
    }
}