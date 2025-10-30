import type { IArticleRepository } from "../../Domain/repositories/IArticleRepository.ts";

export class DeleteArticle {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(id: string): Promise<void> {
    const article = await this.articleRepository.findById(id);
    
    if (!article) {
      throw new Error("Article non trouvé");
    }

    await this.articleRepository.delete(id);
  }
}
