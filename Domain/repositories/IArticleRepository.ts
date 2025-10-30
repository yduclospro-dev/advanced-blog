import { Article } from "../entities/Article.ts";

export interface IArticleRepository {
  create(article: Article): Promise<Article>;
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  update(id: string, article: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<void>;
  toggleLike(articleId: string, userId: string): Promise<Article>;
  toggleDislike(articleId: string, userId: string): Promise<Article>;
}
