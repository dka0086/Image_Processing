import { knex } from "../database/knex";
import { UserDTO } from "../dtos/user.dto";
import { UserModel } from "../model/user-model";

export class UserRepository{
    async findByEmail(email: string): Promise<boolean>{
        const userEmail = await knex<UserModel>("Users").where({"email": email}).first()
        return !!(userEmail)
    }

    async findById(id: number): Promise<UserModel>{
        const [user] = await knex<UserModel>("Users").where({"id": id}).first().returning("*")
        return user
    }

    async save(user: UserDTO): Promise<UserModel>{
        const [newUser] = await knex<UserModel>("Users").insert(
                { 
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                }).returning("*")
        return newUser
    }

    async update(email: string): Promise<boolean>{
        const userEmail = await knex<UserModel>("Users").where({"email": email}).first()
        return !!(userEmail)
    }

    async deleteByEmail(email: string): Promise<UserModel>{
        const [user] = await knex<UserModel>("Users").delete().where({"email": email}).first().returning("*")
        return user
    }
}