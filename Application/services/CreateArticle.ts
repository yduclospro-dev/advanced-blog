import { Article } from "../../Domain/entities/Article.ts";
import type { IArticleRepository } from "../../Domain/repositories/IArticleRepository.ts";

export class CreateArticle {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(
    title: string,
    author: string,
    authorId: string,
    content: string,
    imageUrl?: string
  ): Promise<Article> {
    const article = new Article(
      "",
      title,
      author,
      authorId,
      new Date().toISOString().split("T")[0],
      content,
      [],
      [],
      imageUrl
    );

    if (!article.isValidForCreation()) {
      throw new Error("Les données de l'article sont invalides");
    }

    return await this.articleRepository.create(article);
  }
}
