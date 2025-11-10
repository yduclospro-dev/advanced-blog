
import { UserRepository } from "@infra/repositories/UserRepository";
import { ArticleRepository } from "@infra/repositories/ArticleRepository";
import { RefreshTokenRepository } from "@infra/repositories/RefreshTokenRepository";
import { CommentRepository } from "@infra/repositories/CommentRepository";
import { UserService } from "@app/services/User/UserService";
import { ArticleService } from "@app/services/Article/ArticleService";
import { ImageUploadService } from "@app/services/Image/ImageUploadService";
import { CommentService } from "@app/services/Comment/CommentService";

const userRepository = new UserRepository();
const articleRepository = new ArticleRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const commentRepository = new CommentRepository();

export const userService = new UserService(userRepository, refreshTokenRepository);
export const articleService = new ArticleService(articleRepository);
export const imageUploadService = new ImageUploadService();
export const commentService = new CommentService(commentRepository);