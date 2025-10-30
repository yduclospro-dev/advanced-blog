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
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      // For security, don't reveal if email exists or not
      // Just silently return success
      return;
    }

    // Generate reset token
    const resetToken = user.generateResetToken();

    // Save token and expiry to database
    await this.userRepository.updateResetToken(
      user.id,
      resetToken,
      user.resetPasswordExpires!
    );

    // Send email with reset link
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }
}
