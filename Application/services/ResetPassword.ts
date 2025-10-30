import type { IUserRepository } from "../../Domain/repositories/IUserRepository.ts";
import bcrypt from "bcryptjs";

export class ResetPassword {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByResetToken(token);

    if (!user) {
      throw new Error("Token invalide ou expiré");
    }

    if (!user.isResetTokenValid()) {
      throw new Error("Token expiré");
    }

    if (newPassword.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePassword(user.id, hashedPassword);

    await this.userRepository.clearResetToken(user.id);
  }
}
