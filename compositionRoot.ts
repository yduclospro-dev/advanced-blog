import { UserRepository } from "./Infrastructure/repositories/UserRepository.ts";
import { ArticleRepository } from "./Infrastructure/repositories/ArticleRepository.ts";
import { UserService } from "./Application/services/User/UserService.ts";
import { ArticleService } from "./Application/services/Article/ArticleService.ts";

const userRepository = new UserRepository();
const articleRepository = new ArticleRepository();

export const userService = new UserService(userRepository);
export const articleService = new ArticleService(articleRepository);