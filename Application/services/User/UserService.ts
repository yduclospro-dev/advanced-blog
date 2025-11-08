import type { IUserRepository } from "../../../Domain/repositories/IUserRepository.ts";
import { User } from "../../../Domain/entities/User.ts";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(userName: string, email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("L'email de l'utilisateur existe déjà");
    }

    const user = new User("", userName, email, password);
    if (!user.isPasswordValid()) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.setPassword(hashedPassword);
    return await this.userRepository.create(user);
  }

  async login(email: string, password: string): Promise<User> {
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

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
