import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;
  private from: string;

  constructor(apiKey: string, from: string) {
    this.resend = new Resend(apiKey);
    this.from = from;
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
