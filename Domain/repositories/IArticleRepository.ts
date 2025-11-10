import { Article } from "../entities/Article.ts";

export interface IArticleRepository {
  create(article: Article): Promise<Article>;
  findAll(): Promise<Article[]>;
  /**
   * Pagination: retourne les articles paginés et le total
   */
  findAllPaginated(params: { page: number; limit: number }): Promise<{ articles: Article[]; total: number }>;
  findById(id: string): Promise<Article | null>;
  update(id: string, article: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<void>;
  /**
   * Recherche paginée par terme sur toutes les propriétés principales
   */
  searchPaginated(params: { page: number; limit: number; search: string }): Promise<{ articles: Article[]; total: number }>;
}
