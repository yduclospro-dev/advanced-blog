import { emailQueue } from "./queueConfig";
import { EmailService } from "../services/EmailService";

export interface EmailJobData {
  type: "password-reset";
  to: string;
  resetLink: string;
}

emailQueue.process(async (job) => {
  const { type, to, resetLink } = job.data as EmailJobData;

  console.log(`Processing email job ${job.id}: ${type} to ${to}`);

  const emailService = new EmailService();

  try {
    if (type === "password-reset") {
      await emailService.sendResetPasswordEmail(to, resetLink);
      console.log(`✅ Password reset email sent to ${to}`);
    }

    return { success: true, sentTo: to };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
});

export async function sendPasswordResetEmail(
  to: string,
  resetLink: string
): Promise<void> {
  await emailQueue.add(
    {
      type: "password-reset",
      to,
      resetLink,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    }
  );

  console.log(`📧 Password reset email job queued for ${to}`);
}
