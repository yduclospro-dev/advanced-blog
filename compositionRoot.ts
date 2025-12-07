import { UserRepository } from "@infra/repositories/UserRepository";
import { ArticleRepository } from "@infra/repositories/ArticleRepository";
import { CommentRepository } from "@infra/repositories/CommentRepository";
import { UserService } from "@app/services/User/UserService";
import { ArticleService } from "@app/services/Article/ArticleService";
import { ImageUploadService } from "@app/services/Image/ImageUploadService";
import { CommentService } from "@app/services/Comment/CommentService";
import { PasswordResetService } from "@app/services/User/PasswordResetService";
import { EmailService } from "@infra/services/EmailService";
import { AuthRateLimitService } from "@infra/services/AuthRateLimitService";

export function createCompositionRoot() {
  const userRepository = new UserRepository();
  const articleRepository = new ArticleRepository();
  const commentRepository = new CommentRepository();

  const userService = new UserService(userRepository);
  const articleService = new ArticleService(articleRepository);
  const imageUploadService = new ImageUploadService();
  const commentService = new CommentService(commentRepository);
  const emailService = new EmailService();
  const passwordResetService = new PasswordResetService(userService);
  const authRateLimitService = new AuthRateLimitService();

  return {
    userService,
    articleService,
    imageUploadService,
    commentService,
    emailService,
    passwordResetService,
    authRateLimitService,
  };
}