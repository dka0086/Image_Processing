import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import { AuthService } from "../services/auth-service";

export class AuthController {
    constructor(private service: AuthService) {}

    userSchema = z.object({
        email: z.email(),
        password: z.string().min(5).max(50),
    })

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try{
           const userObj = this.userSchema.parse(req.body)
           const { token, user } = await this.service.login(userObj.email, userObj.password) 
           res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
           })

           return res.status(200).json({ user });
        } catch(err){
            next(err)
        }  
    }
}