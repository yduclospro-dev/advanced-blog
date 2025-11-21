import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;
  private from: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.RESEND_FROM || 'noreply@mieru-app.space';
  }

  async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html: `<p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :</p><p><a href="${resetLink}">${resetLink}</a></p>`
    });
  }
}
