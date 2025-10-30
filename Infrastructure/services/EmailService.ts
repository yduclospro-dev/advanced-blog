import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${process.env.RESET_PASSWORD_URL || "http://localhost:3000/reset-password"}?token=${resetToken}`;

    try {
      const result = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "delivered@resend.dev", 
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Réinitialisation de votre mot de passe</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      
                      <!-- Header -->
                      <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: inline-block; margin-bottom: 20px;">
                            <div style="color: white; font-size: 32px; line-height: 60px;">🔒</div>
                          </div>
                          <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">Réinitialisation de mot de passe</h1>
                        </td>
                      </tr>

                      <!-- Info Badge -->
                      <tr>
                        <td style="padding: 0 40px;">
                          <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
                            <p style="margin: 0; color: #667eea; font-size: 14px; font-weight: 500;">
                              📧 Email destiné à: <strong>${email}</strong>
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 0 40px 30px 40px;">
                          <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 24px;">
                            Bonjour,
                          </p>
                          <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 24px;">
                            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
                          </p>
                        </td>
                      </tr>

                      <!-- Button -->
                      <tr>
                        <td style="padding: 0 40px 30px 40px;" align="center">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                            Réinitialiser mon mot de passe
                          </a>
                        </td>
                      </tr>

                      <!-- Timer Warning -->
                      <tr>
                        <td style="padding: 0 40px 30px 40px;">
                          <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px;">
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 20px;">
                              ⏱️ Ce lien expirera dans <strong>1 heure</strong> pour des raisons de sécurité.
                            </p>
                          </div>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding: 0 40px;">
                          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                        </td>
                      </tr>

                      <!-- Security Notice -->
                      <tr>
                        <td style="padding: 20px 40px;">
                          <p style="margin: 0 0 12px 0; color: #718096; font-size: 14px; line-height: 20px;">
                            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe ne sera pas modifié.
                          </p>
                        </td>
                      </tr>

                      <!-- Alternative Link -->
                      <tr>
                        <td style="padding: 0 40px 30px 40px;">
                          <p style="margin: 0 0 8px 0; color: #718096; font-size: 13px; line-height: 18px;">
                            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                          </p>
                          <p style="margin: 0; color: #667eea; font-size: 12px; line-height: 18px; word-break: break-all;">
                            ${resetUrl}
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 20px 40px; background-color: #f7fafc; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                          <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }
}
