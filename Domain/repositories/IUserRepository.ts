import { User } from "../entities/User.ts";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
  updateResetToken(userId: string, token: string, expires: Date): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  clearResetToken(userId: string): Promise<void>;
}