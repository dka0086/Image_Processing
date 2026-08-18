import { UserResponseDTO, toUserResponse } from "../dtos/user-response.dto"
import bcrypt from "bcrypt"
import { ConflictError } from "../errors/conflict-error"
import { NotFoundError } from "../errors/notfound-error"
import { UserRepository } from "../repository/user.repository"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../errors/unauthorized-error"

export class AuthService {
  constructor(private repository = new UserRepository()) {}
  public static hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  public login = async (email: string, password: string) => {
    try {
      if (password == null || email == null) {
        throw new Error("Campos vazios.")
      }
      const user = await this.repository.findByEmail(email);
      if (!user) {
        throw new ConflictError("Email já cadastrado")
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
            throw new UnauthorizedError("Email ou senha inválidos");
        }
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
      return { token, user: toUserResponse(user) }
    } catch (err: any) {
      throw new Error("Database exception.")
    }
  }

  public userIsAdmin = async (email: string, password: string) => {
    try {
      if (password == null || email == null) {
        throw new Error("Campos vazios.");
      }
      const user = await this.repository.findByEmail(email);
      if (!user) {
        throw new ConflictError("Email já cadastrado");
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
            throw new UnauthorizedError("Email ou senha inválidos");
        }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
      return { token, user };
    } catch (err: any) {
      throw new Error("Database exception.");
    }
  }
}