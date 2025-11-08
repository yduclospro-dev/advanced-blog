import { Article } from "../../../Domain/entities/Article.ts";
import type { IArticleRepository } from "../../../Domain/repositories/IArticleRepository.ts";
import { DisplayArticleDto } from "../../dtos/Article/DisplayArticleDto.ts";
import { CreateArticleDto } from "../../dtos/Article/CreateArticleDto.ts";

export class ArticleService {
  private _articleRepository: IArticleRepository;

  constructor(articleRepository: IArticleRepository) {
    this._articleRepository = articleRepository;
  }

  async create(
    title: string,
    author: string,
    authorId: string,
    content: string,
    imageUrl?: string
  ): Promise<CreateArticleDto> {
    const article = new Article(
      title,
      author,
      authorId,
      new Date().toISOString().split("T")[0],
      content,
      imageUrl
    );

    if (!article.isValidForCreation()) {
      throw new Error("Les données de l'article sont invalides");
    }

    const createdArticle = await this._articleRepository.create(article);

    if (!createdArticle.id) {
      throw new Error("Échec de la création de l'article");
    }

    return {
      id: createdArticle.id,
      title: createdArticle.title,
      author: createdArticle.author,
      content: createdArticle.content,
      imageUrl: createdArticle.imageUrl
    };
  }

  async findById(id: string): Promise<DisplayArticleDto | null> {
    const article = await this._articleRepository.findById(id);
    if (!article) throw new Error("Article non trouvé");

    return {
      id: article.id as string,
      title: article.title,
      author: article.author,
      content: article.content,
    };
  }

  async findAll(): Promise<Article[]> {
    return await this._articleRepository.findAll();
  }

  // async update(
  //   id: string,
  //   updates: { title?: string; content?: string; imageUrl?: string }
  // ): Promise<Article> {
  //   const article = await this._articleRepository.findById(id);
    
  //   if (!article) {
  //     throw new Error("Article non trouvé");
  //   }

  //   const updatedData: Partial<Article> = {};
  //   if (updates.title) updatedData.title = updates.title.trim();
  //   if (updates.content) updatedData.content = updates.content.trim();
  //   if (updates.imageUrl !== undefined) updatedData.imageUrl = updates.imageUrl;

  //   return await this._articleRepository.update(id, updatedData);
  // }

  // async delete(id: string): Promise<void> {
  //   const article = await this._articleRepository.findById(id);
    
  //   if (!article) {
  //     throw new Error("Article non trouvé");
  //   }

  //   await this._articleRepository.delete(id);
  // }
}