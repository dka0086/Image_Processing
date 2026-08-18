import { Request, Response, NextFunction } from "express";
import { knex } from "../database/knex";
import { UserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user-service";
import { z } from "zod"
import { UserResponseDTO } from "../dtos/user-response.dto";

export class UserController{
    constructor(private service = new UserService()){}
    userSchema = z.object({
        username: z.string().min(2).max(30),
        email: z.email(),
        password: z.string().min(5).max(50),
    })

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const dto = this.userSchema.parse(req.body)
            const newUser = await this.service.insertUser(dto)
            const resDTO: UserResponseDTO = {username: newUser.username, email: newUser.email}
            return res.status(201).json(resDTO)
        }catch(err){
            next(err)
        }
    }

    public selectByEmail = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {email} = req.params
            const user = await this.service.selectUserByEmail(email)
            const dto: UserResponseDTO = { username: user.username, email: user.email }
            res.json(dto)
        }catch(err){
            next(err)
        }
    }
}