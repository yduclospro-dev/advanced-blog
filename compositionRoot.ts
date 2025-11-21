import { UserRepository } from "@infra/repositories/UserRepository";
import { ArticleRepository } from "@infra/repositories/ArticleRepository";
import { CommentRepository } from "@infra/repositories/CommentRepository";
import { UserService } from "@app/services/User/UserService";
import { ArticleService } from "@app/services/Article/ArticleService";
import { ImageUploadService } from "@app/services/Image/ImageUploadService";
import { CommentService } from "@app/services/Comment/CommentService";
import { PasswordResetService } from "@app/services/User/PasswordResetService";
import { EmailService } from "@infra/services/EmailService";

const userRepository = new UserRepository();
const articleRepository = new ArticleRepository();
const commentRepository = new CommentRepository();

export const userService = new UserService(userRepository);
export const articleService = new ArticleService(articleRepository);
export const imageUploadService = new ImageUploadService();
export const commentService = new CommentService(commentRepository);

export const emailService = new EmailService();
export const passwordResetService = new PasswordResetService(userService);