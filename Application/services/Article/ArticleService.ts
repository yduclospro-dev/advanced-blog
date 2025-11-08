import { Article } from "../../../Domain/entities/Article.ts";
import type { IArticleRepository } from "../../../Domain/repositories/IArticleRepository.ts";

export class ArticleService {
  private articleRepository: IArticleRepository;

  constructor(articleRepository: IArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async create(
    title: string,
    author: string,
    content: string,
    imageUrl?: string
  ): Promise<Article> {
    const article = new Article(
      "",
      title,
      author,
      "", // authorId sera rempli par le repository
      new Date().toISOString().split("T")[0],
      content,
      imageUrl
    );

    if (!article.isValidForCreation()) {
      throw new Error("Les données de l'article sont invalides");
    }

    return await this.articleRepository.create(article);
  }

  async update(
    id: string,
    updates: { title?: string; content?: string; imageUrl?: string }
  ): Promise<Article> {
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      throw new Error("Article non trouvé");
    }

    const updatedData: Partial<Article> = {};
    if (updates.title) updatedData.title = updates.title.trim();
    if (updates.content) updatedData.content = updates.content.trim();
    if (updates.imageUrl !== undefined) updatedData.imageUrl = updates.imageUrl;

    return await this.articleRepository.update(id, updatedData);
  }

  async delete(id: string): Promise<void> {
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      throw new Error("Article non trouvé");
    }

    await this.articleRepository.delete(id);
  }

  async findById(id: string): Promise<Article | null> {
    return await this.articleRepository.findById(id);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.findAll();
  }
}
