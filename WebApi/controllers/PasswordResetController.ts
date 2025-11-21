import type { Request, Response, NextFunction } from 'express';
import { PasswordResetService } from '@app/services/User/PasswordResetService';
import { EmailService } from '@infra/services/EmailService';
import { sendApiResponse } from '@webapi/utils/response';

export class PasswordResetController {
  private passwordResetService: PasswordResetService;
  private emailService: EmailService;
  constructor(passwordResetService: PasswordResetService, emailService: EmailService) {
    this.passwordResetService = passwordResetService;
    this.emailService = emailService;
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Refuse si déjà connecté (comme login : cookie refresh_token)
      if (req.cookies && req.cookies.refresh_token) {
        return sendApiResponse(res, {
          success: false,
          message: 'Déjà connecté. Déconnectez-vous pour accéder à cette fonctionnalité.',
          result: null,
          statusCode: 400
        });
      }

      const { email } = req.body;
      if (!email) return sendApiResponse(res, { success: false, message: 'Email requis', result: null, statusCode: 400 });
      const token = this.passwordResetService.generateResetToken(email);
      const resetLink = `http://localhost:3000/api/reset-password?token=${token}`;
      await this.emailService.sendResetPasswordEmail(email, resetLink);
      sendApiResponse(res, {
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
        result: { token, resetLink }
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Refuse si déjà connecté (comme login : cookie refresh_token)
      if (req.cookies && req.cookies.refresh_token) {
        return sendApiResponse(res, {
          success: false,
          message: 'Déjà connecté. Déconnectez-vous pour accéder à cette fonctionnalité.',
          result: null,
          statusCode: 400
        });
      }

      const { token, newPassword } = req.body;
      if (!token || !newPassword) return sendApiResponse(res, { success: false, message: 'Token et nouveau mot de passe requis', result: null, statusCode: 400 });
      await this.passwordResetService.resetPassword(token, newPassword);
      sendApiResponse(res, { success: true, message: 'Mot de passe réinitialisé', result: null });
    } catch (error) {
      next(error);
    }
  }
}