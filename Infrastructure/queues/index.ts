// Export all queues and job functions
export { emailQueue } from "./queueConfig";
export { sendPasswordResetEmail } from "./emailQueue";

// Import workers to start processing jobs
import "./emailQueue";
