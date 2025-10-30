import type { IUserRepository } from "../../Domain/repositories/IUserRepository.ts";
import { EmailService } from "../../Infrastructure/services/EmailService.ts";

export class RequestPasswordReset {
  private userRepository: IUserRepository;
  private emailService: EmailService;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.emailService = new EmailService();
  }

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      return;
    }

    const resetToken = user.generateResetToken();

    await this.userRepository.updateResetToken(
      user.id,
      resetToken,
      user.resetPasswordExpires!
    );

    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }
}
