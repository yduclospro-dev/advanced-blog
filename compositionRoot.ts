import { UserRepository } from "./Infrastructure/repositories/UserRepository.ts";
import { ArticleRepository } from "./Infrastructure/repositories/ArticleRepository.ts";
import { InMemoryRefreshTokenRepository } from "./Infrastructure/repositories/InMemoryRefreshTokenRepository.ts";
import { UserService } from "./Application/services/User/UserService.ts";
import { ArticleService } from "./Application/services/Article/ArticleService.ts";
import { ImageUploadService } from "./Application/services/Image/ImageUploadService.ts";

const userRepository = new UserRepository();
const articleRepository = new ArticleRepository();
const refreshTokenRepository = new InMemoryRefreshTokenRepository();

export const userService = new UserService(userRepository, refreshTokenRepository);
export const articleService = new ArticleService(articleRepository);
export const imageUploadService = new ImageUploadService();