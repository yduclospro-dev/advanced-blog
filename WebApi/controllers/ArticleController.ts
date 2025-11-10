
import type { Request, Response, NextFunction } from "express";
import { ArticleService } from "@app/services/Article/ArticleService.ts";
import { UnauthorizedError } from "@domain/errors/index.ts";
import { validateRequiredFields } from "../utils/validation.ts";


export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  async searchArticles(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string);
      let limit = parseInt(req.query.limit as string);
      const search = (req.query.search as string) || "";
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;
      if (page < 1 || limit < 1 || limit > 100) {
        const { BadRequestError } = await import("@domain/errors/BadRequestError.ts");
        throw new BadRequestError("Paramètres de pagination invalides (page >= 1, 1 <= limit <= 100)");
      }
      const result = await this.articleService.searchPaginated(page, limit, search);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Pagination : ?page=1&limit=10
      let page = parseInt(req.query.page as string);
      let limit = parseInt(req.query.limit as string);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;
      // Contrôle strict : refuse les valeurs absurdes
      if (page < 1 || limit < 1 || limit > 100) {
        // 100 = limite max raisonnable côté API
        const { BadRequestError } = await import("@domain/errors/BadRequestError.ts");
        throw new BadRequestError("Paramètres de pagination invalides (page >= 1, 1 <= limit <= 100)");
      }
      const result = await this.articleService.findAllPaginated(page, limit);
      res.status(200).json(result);
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
      const authorId = req.user?.id;

      if (!authorId) {
        throw new UnauthorizedError("Utilisateur non authentifié");
      }

      validateRequiredFields(req.body, ['title', 'content']);

      const { title, content, imageUrl } = req.body;

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
