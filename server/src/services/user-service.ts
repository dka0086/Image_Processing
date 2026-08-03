import { UserModel } from "../model/user.model"
import {knex} from "../database/knex"
import { UserRepository } from "../repository/user.repository"
import { UserDTO } from "../dtos/user.dto"
import { ConflictError } from "../errors/conflict-error"
import { NotFoundError } from "../errors/notfound-error"

export class UserService {
    constructor(private repository = new UserRepository()) {}
    public async insertUser(user: UserDTO){
        try{
            if(user == null){
                throw new Error("Campos vazios.")
            }
            const hasInDb = await this.repository.findByEmail(user.email)
            if (hasInDb) {
                throw new ConflictError("Email já cadastrado");
            }
            const newUser = await this.repository.save(user)
            return newUser
        }catch(err: any){
            throw new Error("Database exception.")
        }
    }
    
    public async selectUserByEmail(email: string){
        try{
            if(email == null){
                throw new Error("Campo vazio.")
            }

            const user = await this.repository.findByEmail(email)
            if (!user) {
                throw new NotFoundError("Email não cadastrado");
            }
            return user
        }catch(err: any){
            throw new Error("Database exception.")
        }
    }

    public async selectUserById(id: number){
        try{
            if(id == null){
                throw new Error("Campo vazio.")
            }

            const user = await this.repository.findById(id)
            if (!user) {
                throw new NotFoundError("Usuário não cadastrado");
            }
            return user
        }catch(err: any){
            throw new Error("Database exception.")
        }
    }

    public async selectAllUsers(){
        try{
            const users = await this.repository.findAll()
            return users
        }catch(err: any){
            throw new Error("Database exception.")
        }
    }
}