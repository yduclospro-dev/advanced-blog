import type { IArticleRepository } from "../../Domain/repositories/IArticleRepository.ts";

export class DeleteArticle {
  private articleRepository: IArticleRepository;

  constructor(articleRepository: IArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async execute(id: string): Promise<void> {
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      throw new Error("Article non trouvé");
    }

    await this.articleRepository.delete(id);
  }
}
