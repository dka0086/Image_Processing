import { UserModel } from "../model/user-model"
import knex from "knex"

export class UserService {
    public async insertUser(user: UserModel){
        if(user == null){
            return null
        }
        const hasInDb = await knex<UserModel>("Users").where()
    } 
}