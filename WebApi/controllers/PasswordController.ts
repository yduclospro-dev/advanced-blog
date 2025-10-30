import type { Request, Response } from "express";
import { UserRepository } from "../../Infrastructure/repositories/UserRepository.ts";
import { RequestPasswordReset } from "../../Application/services/RequestPasswordReset.ts";
import { ResetPassword } from "../../Application/services/ResetPassword.ts";

export class PasswordController {
  private requestPasswordReset: RequestPasswordReset;
  private resetPasswordService: ResetPassword;

  constructor() {
    const userRepository = new UserRepository();
    this.requestPasswordReset = new RequestPasswordReset(userRepository);
    this.resetPasswordService = new ResetPassword(userRepository);
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    try {
      await this.requestPasswordReset.execute(email);
      res.status(200).json({ 
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé" 
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token et nouveau mot de passe requis" });
    }

    try {
      await this.resetPasswordService.execute(token, newPassword);
      res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      res.status(400).json({ error: errorMessage });
    }
  }
}
