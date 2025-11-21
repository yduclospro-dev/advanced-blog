import { Article } from "@domain/entities/Article.ts";

export interface IArticleRepository {
  create(article: Article): Promise<Article>;
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  update(id: string, article: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<void>;
  searchPaginated(params: { page: number; limit: number; search: string }): Promise<{ articles: Article[]; total: number }>;
}