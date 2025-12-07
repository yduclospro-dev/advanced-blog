
import type { Request, Response, NextFunction } from "express";
import { sendApiResponse } from '@webapi/utils/response';
import { ArticleService } from "@app/services/Article/ArticleService";
import { UnauthorizedError } from "@domain/errors/index";
import { validateRequiredFields } from "@webapi/utils/validation";
import { BadRequestError } from "@domain/errors/index";

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  async searchArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const pageRaw = req.query.page as string;
      const limitRaw = req.query.limit as string;
      const search = (req.query.q as string) || "";
      const page = parseInt(pageRaw);
      const limit = parseInt(limitRaw);

      if ((pageRaw !== undefined && isNaN(page)) || (limitRaw !== undefined && isNaN(limit))) {
        throw new BadRequestError("Paramètres de pagination non numériques");
      }

      if (page < 1 || limit < 1) {
        throw new BadRequestError("Paramètres de pagination invalides (page >= 1, limit >= 1)");
      }

      const result = await this.articleService.searchPaginated(page, limit, search);
      sendApiResponse(res, {
        success: true,
        result: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const article = await this.articleService.findById(id);

      sendApiResponse(res, {
        success: true,
        result: article
      });
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

      sendApiResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Article créé',
        result: createdArticle
      });
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

      sendApiResponse(res, {
        success: true,
        message: 'Article mis à jour',
        result: updatedArticle
      });
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
      sendApiResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Article supprimé',
        result: null
      });
    } catch (error) {
      next(error);
    }
  }
}