import { Resend } from 'resend';

export class EmailService {
  private _resend: Resend | null = null;

  constructor() {
    this.from = process.env.RESEND_FROM || 'noreply@mieru-app.space';
  }

  private get resend() {
    if (!this._resend) {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY manquant");
      }
      this._resend = new Resend(process.env.RESEND_API_KEY);
    }
    return this._resend;
  }

  private from: string;

  async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html: `<p>Pour réinitialiser votre mot de passe, cliquez ici :</p>
             <p><a href="${resetLink}">${resetLink}</a></p>`
    });
  }
}