import type { IUserRepository } from "../../Domain/repositories/IUserRepository.ts";
import { User } from "../../Domain/entities/User.ts";
import bcrypt from "bcryptjs";

export class LoginUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }

    return user;
  }
}
