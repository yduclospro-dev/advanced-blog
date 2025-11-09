import { Article } from "@domain/entities/Article";
import type { IArticleRepository } from "@domain/repositories/IArticleRepository";
import { DisplayArticleDto } from "../../dtos/Article/DisplayArticleDto.ts";
import { CreateArticleDto } from "../../dtos/Article/CreateArticleDto.ts";
import { UserRole } from "@prisma/client";
import { isOwnerOrAdmin } from "@domain/utils/permissions.ts";
import { BadRequestError, NotFoundError, ForbiddenError } from "@domain/errors";

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
    const article = new Article(
      title,
      "",
      authorId,
      new Date().toISOString().split("T")[0],
      content,
      imageUrl
    );

    if (!article.isValidForCreation()) {
      throw new BadRequestError("Les données de l'article sont invalides");
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
    if (!article) throw new NotFoundError("Article non trouvé");

    return {
      id: article.id as string,
      title: article.title,
      author: article.author,
      authorId: article.authorId,
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
      authorId: article.authorId,
      content: article.content,
      imageUrl: article.imageUrl,
      date: article.date
    }));
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    updates: { title?: string; content?: string; imageUrl?: string }
  ): Promise<DisplayArticleDto> {
    const article = await this._articleRepository.findById(id);
    
    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }

    if (!isOwnerOrAdmin(userId, article.authorId, userRole)) {
      throw new ForbiddenError("Non autorisé à modifier cet article");
    }

    const updatedData: Partial<{ title: string; content: string; imageUrl: string }> = {};
    if (updates.title) updatedData.title = updates.title.trim();
    if (updates.content) updatedData.content = updates.content.trim();
    if (updates.imageUrl !== undefined) updatedData.imageUrl = updates.imageUrl;

    const updated = await this._articleRepository.update(id, updatedData);

    return {
      id: updated.id as string,
      title: updated.title,
      author: updated.author,
      authorId: updated.authorId,
      content: updated.content,
      date: updated.date,
      imageUrl: updated.imageUrl
    };
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const article = await this._articleRepository.findById(id);
    
    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }

    if (!isOwnerOrAdmin(userId, article.authorId, userRole)) {
      throw new ForbiddenError("Non autorisé à supprimer cet article");
    }

    await this._articleRepository.delete(id);
  }
}