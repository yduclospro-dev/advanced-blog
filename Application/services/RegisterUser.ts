
import type { IUserRepository } from "../../Domain/repositories/IUserRepository.ts";
import { User } from "../../Domain/entities/User.ts";
import bcrypt from "bcryptjs";

export class RegisterUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userName: string, email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("L'email de l'utilisateur existe déjà");
    }
    const user = new User("", userName, email, password);
    if (!user.isPasswordValid()) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    console.log("USER TO REGISTER: ", user);

    const hashedPassword = await bcrypt.hash(password, 10);
    user.setPassword(hashedPassword);
    return await this.userRepository.create(user);
  }
}
