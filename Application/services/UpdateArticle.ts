import { Article } from "../../Domain/entities/Article.ts";
import type { IArticleRepository } from "../../Domain/repositories/IArticleRepository.ts";

export class UpdateArticle {
  private articleRepository: IArticleRepository;

  constructor(articleRepository: IArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(
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
}
