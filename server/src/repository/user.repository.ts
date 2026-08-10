import { knex } from "../database/knex";
import { UserDTO } from "../dtos/user.dto";
import { UserModel } from "../model/user.model";

export class UserRepository{
    public async findByEmail(email: string): Promise<UserModel | undefined>{
        const userEmail = await knex<UserModel>("Users").where({"email": email}).first()
        return userEmail
    }

    public async findById(id: number): Promise<UserModel>{
        const [user] = await knex<UserModel>("Users").where({"id": id})
        return user
    }

    public async save(user: UserDTO): Promise<UserModel>{
        const [newUser] = await knex<UserModel>("Users").insert(
                { 
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    created_at: new Date(),
                    updated_at: new Date(),
                }).returning("*")
        return newUser
    }

    public async update(email: string): Promise<boolean>{
        const userEmail = await knex<UserModel>("Users").where({"email": email}).first()
        return !!(userEmail)
    }

    public async deleteByEmail(email: string): Promise<UserModel>{
        const [user] = await knex<UserModel>("Users").where({"email": email}).delete().returning("*")
        return user
    }

    public async findAll(): Promise<UserModel[]>{
        const users = await knex<UserModel>("Users").select("*")
        return users
    }
}