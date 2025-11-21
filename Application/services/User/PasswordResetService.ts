import jwt from 'jsonwebtoken';
import { UserService } from './UserService';

const RESET_SECRET = process.env.JWT_SECRET || 'reset-secret';
const RESET_EXPIRATION = '1h';

export class PasswordResetService {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  generateResetToken(email: string) {
    return jwt.sign({ email }, RESET_SECRET, { expiresIn: RESET_EXPIRATION });
  }

  verifyResetToken(token: string): { email: string } {
    return jwt.verify(token, RESET_SECRET) as { email: string };
  }

  async resetPassword(token: string, newPassword: string) {
    const { email } = this.verifyResetToken(token);
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('Utilisateur non trouvé');
    await this.userService.updatePassword(user.id, newPassword);
    return true;
  }
}