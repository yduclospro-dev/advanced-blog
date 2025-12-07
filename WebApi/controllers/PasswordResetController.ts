import type { Request, Response, NextFunction } from 'express';
import { PasswordResetService } from '@app/services/User/PasswordResetService';
import { sendPasswordResetEmail } from '@infra/queues';
import { sendApiResponse } from '@webapi/utils/response';

export class PasswordResetController {
  private passwordResetService: PasswordResetService;
  
  constructor(passwordResetService: PasswordResetService) {
    this.passwordResetService = passwordResetService;
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
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
      
      // Send email asynchronously via queue
      await sendPasswordResetEmail(email, token);
      
      sendApiResponse(res, {
        success: true,
        message: 'Si cet email existe, un token de réinitialisation a été envoyé.',
        result: { token }
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.cookies && req.cookies.refresh_token) {
        return sendApiResponse(res, {
          success: false,
          message: 'Déjà connecté. Déconnectez-vous pour accéder à cette fonctionnalité.',
          result: null,
          statusCode: 400
        });
      }

      const token = req.body.token;
      const newPassword = req.body.newPassword;
      
      if (!token || !newPassword) {
        return sendApiResponse(res, { success: false, message: 'Token et nouveau mot de passe requis', result: null, statusCode: 400 });
      }

      await this.passwordResetService.resetPassword(token as string, newPassword);
      sendApiResponse(res, { success: true, message: 'Mot de passe réinitialisé', result: null });
    } catch (error) {
      next(error);
    }
  }
}