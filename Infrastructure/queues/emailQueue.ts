import { emailQueue } from "./queueConfig";
import { EmailService } from "../services/EmailService";

// Job data interface
export interface EmailJobData {
  type: "password-reset";
  to: string;
  resetLink: string;
}

// Process email jobs
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
    throw error; // Bull will retry the job
  }
});

// Add a job to the email queue
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
      attempts: 3, // Retry up to 3 times
      backoff: {
        type: "exponential",
        delay: 2000, // Start with 2 seconds, then 4s, 8s
      },
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: false, // Keep failed jobs for debugging
    }
  );

  console.log(`📧 Password reset email job queued for ${to}`);
}
