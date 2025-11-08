import type { Request, Response, NextFunction } from "express";
import { ArticleService } from "../../Application/services/Article/ArticleService.ts";
import { BadRequestError, UnauthorizedError } from "../../Domain/errors/index.ts";

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = await this.articleService.findAll();
      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const article = await this.articleService.findById(id);
      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, imageUrl } = req.body;
      const authorId = req.user?.id;

      if (!authorId) {
        throw new UnauthorizedError("Utilisateur non authentifié");
      }

      if (!title || !content) {
        throw new BadRequestError("Champs requis manquants: title et content sont obligatoires");
      }

      const createdArticle = await this.articleService.create(
        title,
        authorId,
        content,
        imageUrl
      );

      res.status(201).json(createdArticle);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content, imageUrl } = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        throw new UnauthorizedError("Utilisateur non authentifié");
      }

      const updatedArticle = await this.articleService.update(id, userId, userRole, {
        title,
        content,
        imageUrl,
      });
      res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        throw new UnauthorizedError("Utilisateur non authentifié");
      }

      await this.articleService.delete(id, userId, userRole);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
