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
    authorId: string,
    content: string,
    imageUrl?: string
  ): Promise<CreateArticleDto> {
    // On ne prend plus "author" en paramètre, on le récupérera du repository avec l'authorId
    const article = new Article(
      title,
      "", // author sera rempli par le repository après récupération du user
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
      date: article.date,
      imageUrl: article.imageUrl
    };
  }

  async findAll(): Promise<DisplayArticleDto[]> {
    const articles = await this._articleRepository.findAll();

    return articles.map(article => ({
      id: article.id as string,
      title: article.title,
      author: article.author,
      content: article.content,
      imageUrl: article.imageUrl,
      date: article.date
    }));
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