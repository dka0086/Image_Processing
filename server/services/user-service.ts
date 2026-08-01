import { UserModel } from "../model/user-model"
import {knex} from "../database/knex"

export class UserService {
    public async insertUser(user: UserModel){
        try{
            const hasInDb = await knex<UserModel>("Users").where({"email": user.email}).first()
            if(user == null || hasInDb){
                throw new Error("Fields ")
            }
            
            
            return newUser
        }catch(err: any){
            throw new Error("Database exception.")
        }
    } 
}