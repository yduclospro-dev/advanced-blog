  import jwt from 'jsonwebtoken';   
import type { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import type { UserDto } from "@app/dtos/User/UserDto";
import bcrypt from "bcryptjs";
import { ConflictError, BadRequestError, UnauthorizedError } from "@domain/errors";

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(userName: string, email: string, password: string): Promise<UserDto> {
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictError("L'email de l'utilisateur existe déjà");
    }

    const existingUserName = await this.userRepository.findByUserName(userName);
    if (existingUserName) {
      throw new ConflictError("Le nom d'utilisateur existe déjà");
    }

    const user = new User(userName, email, password);
    if (!user.isPasswordValid()) {
      throw new BadRequestError("Le mot de passe doit contenir au moins 6 caractères");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.setPassword(hashedPassword);
    const createdUser = await this.userRepository.create(user);
    
    if (!createdUser.id) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    return {
      id: createdUser.id,
      userName: createdUser.userName,
      email: createdUser.email,
      role: createdUser.role
    };
  }

  async verifyCredentials(email: string, password: string): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Identifiants incorrects");
    }

    return {
      id: user.id as string,
      userName: user.userName,
      email: user.email,
      role: user.role
    };
  }

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    
    if (!user || !user.id) {
      return null;
    }

    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role
    };
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.id) {
      return null;
    }

    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role
    };
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.getAll();
    return users.map(user => ({
      id: user.id as string,
      userName: user.userName,
      email: user.email,
      role: user.role
    }));
  }
  
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) throw new BadRequestError("Le mot de passe doit contenir au moins 6 caractères");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}