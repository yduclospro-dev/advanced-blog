import { NotFoundError } from "@domain/errors/NotFoundError";
import { sendApiResponse } from '@webapi/utils/response';
import { ForbiddenError } from "@domain/errors/ForbiddenError";
import { validateRequiredFields } from "@webapi/utils/validation";
import { Request, Response, NextFunction } from 'express';
import type { CreateCommentDto, UpdateCommentDto } from '@app/dtos/Comment/CommentDto';
import { CommentService } from "@app/services/Comment/CommentService";
import { articleService } from '../../compositionRoot';

export class CommentController {
  private articleService;
  private commentService;

  constructor(commentService: CommentService) {
    this.articleService = articleService;
    this.commentService = commentService;
  }

  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequiredFields(req.body, ["content"]);
      const articleId = req.params.articleId;

      var article = await articleService.findById(articleId);
      if (!article) {
        throw new NotFoundError('Article non trouvé');
      }
      const dto: CreateCommentDto = {
        ...req.body,
        articleId,
        userId: req.user?.id,
      };
      const comment = await this.commentService.createComment(dto);
      sendApiResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Commentaire créé',
        result: comment
      });
    } catch (err) {
      next(err);
    }
  }

  async getCommentsByArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const articleId = req.params.articleId;
      // Vérifie que l'article existe avant de chercher les commentaires
      var article = await articleService.findById(articleId);
      if (!article) {
        throw new NotFoundError('Article non trouvé');
      }

      const comments = await this.commentService.getCommentsByArticle(articleId);
      sendApiResponse(res, {
        success: true,
        result: comments
      });
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const existing = await this.commentService.getCommentById(id);
      if (existing?.userId !== req.user?.id) {
        throw new ForbiddenError('Action interdite');
      }
      
      if (!existing) {
        throw new NotFoundError('Commentaire non trouvé');
      }

      validateRequiredFields(req.body, ["content"]);
      
      const dto: UpdateCommentDto = req.body;
      const comment = await this.commentService.updateComment(id, dto);
      sendApiResponse(res, {
        success: true,
        message: 'Commentaire modifié',
        result: comment
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const existing = await this.commentService.getCommentById(id);
      if (existing?.userId !== req.user?.id) {
        throw new ForbiddenError('Action interdite');
      }
      
      if (!existing) {
        throw new NotFoundError('Commentaire non trouvé');
      }
      
      await this.commentService.deleteComment(id);
      sendApiResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Commentaire supprimé',
        result: null
      });
    } catch (err) {
      next(err);
    }
  }
}