import type { IUserRepository } from "../../Domain/repositories/IUserRepository.ts";
import bcrypt from "bcryptjs";

export class ResetPassword {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(token: string, newPassword: string): Promise<void> {
    // Find user by reset token
    const user = await this.userRepository.findByResetToken(token);

    if (!user) {
      throw new Error("Token invalide ou expiré");
    }

    // Check if token is still valid (not expired)
    if (!user.isResetTokenValid()) {
      throw new Error("Token expiré");
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await this.userRepository.updatePassword(user.id, hashedPassword);

    // Clear reset token
    await this.userRepository.clearResetToken(user.id);
  }
}
