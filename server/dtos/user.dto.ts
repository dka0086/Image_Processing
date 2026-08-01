import { UserModel } from "../model/user-model";

export type UserDTO = {
    username: string,
    email: string,
    password: string,
    created_at: Date,
    updated_at: Date,   
}

