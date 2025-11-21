import { UserRepository } from "@infra/repositories/UserRepository";
import { ArticleRepository } from "@infra/repositories/ArticleRepository";
import { CommentRepository } from "@infra/repositories/CommentRepository";
import { UserService } from "@app/services/User/UserService";
import { ArticleService } from "@app/services/Article/ArticleService";
import { ImageUploadService } from "@app/services/Image/ImageUploadService";
import { CommentService } from "@app/services/Comment/CommentService";

const userRepository = new UserRepository();
const articleRepository = new ArticleRepository();
const commentRepository = new CommentRepository();


export const userService = new UserService(userRepository);
export const articleService = new ArticleService(articleRepository);
export const imageUploadService = new ImageUploadService();
export const commentService = new CommentService(commentRepository);

import { PasswordResetController } from "@webapi/controllers/PasswordResetController";
import { PasswordResetService } from "@app/services/User/PasswordResetService";
import { EmailService } from "@infra/services/EmailService";
// Charger les variables d'environnement pour Resend
const resendApiKey = process.env.RESEND_API_KEY || '';
const resendFrom = process.env.RESEND_FROM || 'no-reply@example.com';
const emailService = new EmailService(resendApiKey, resendFrom);
const passwordResetService = new PasswordResetService(userService);
export const passwordResetController = new PasswordResetController(passwordResetService, emailService);