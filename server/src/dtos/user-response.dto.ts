import { UserModel } from "../model/user.model"

export type UserResponseDTO = {
    username: string,
    email: string  
}

export function toUserResponse(user: UserModel): UserResponseDTO{
    return {
        username: user.username,
        email: user.email
    }
}