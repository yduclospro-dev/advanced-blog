import { UserRepository } from "@infra/repositories/UserRepository";
import { ArticleRepository } from "@infra/repositories/ArticleRepository";
import { RefreshTokenRepository } from "@infra/repositories/RefreshTokenRepository";
import { UserService } from "@app/services/User/UserService";
import { ArticleService } from "@app/services/Article/ArticleService";
import { ImageUploadService } from "@app/services/Image/ImageUploadService";

const userRepository = new UserRepository();
const articleRepository = new ArticleRepository();
const refreshTokenRepository = new RefreshTokenRepository();

export const userService = new UserService(userRepository, refreshTokenRepository);
export const articleService = new ArticleService(articleRepository);
export const imageUploadService = new ImageUploadService();