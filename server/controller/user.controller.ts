import { Request, Response, NextFunction, response } from "express";
import { knex } from "../database/knex";
import { UserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user-service";

export class userController{
    constructor(private service = new UserService()){}

    public async create(req: Request, res: Response, next: NextFunction){
        try{
            const dto = req.body()
            const newUser = await this.service.insertUser(dto)
            return res.status(201).json(newUser)
        }catch(err){
            next(err);
        }
    }
}