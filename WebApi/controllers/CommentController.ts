import { NotFoundError } from "@domain/errors/NotFoundError";
import { ForbiddenError } from "@domain/errors/ForbiddenError";
import { validateRequiredFields } from "../utils/validation";
import { Request, Response, NextFunction } from 'express';
import type { CreateCommentDto, UpdateCommentDto } from '@app/dtos/CommentDto';
import { CommentService } from "@app/services/Comment/CommentService";



export class CommentController {
  private commentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequiredFields(req.body, ["content"]);
      const articleId = req.params.articleId;
      const dto: CreateCommentDto = {
        ...req.body,
        articleId,
        userId: req.user?.id,
      };
      const comment = await this.commentService.createComment(dto);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async getCommentsByArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const articleId = req.params.articleId;
      const comments = await this.commentService.getCommentsByArticle(articleId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }


  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequiredFields(req.body, ["content"]);
      const id = req.params.id;
      const dto: UpdateCommentDto = req.body;
      const existing = await this.commentService.getCommentById(id);
      if (!existing) {
        throw new NotFoundError('Commentaire non trouvé');
      }
      if (existing.userId !== req.user?.id) {
        throw new ForbiddenError('Action interdite');
      }
      const comment = await this.commentService.updateComment(id, dto);
      res.json(comment);
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const existing = await this.commentService.getCommentById(id);
      if (!existing) {
        throw new NotFoundError('Commentaire non trouvé');
      }
      if (existing.userId !== req.user?.id) {
        throw new ForbiddenError('Action interdite');
      }
      await this.commentService.deleteComment(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
