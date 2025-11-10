

import type { ICommentRepository } from '@domain/repositories/ICommentRepository';
import type { CreateCommentDto, UpdateCommentDto, CommentDto } from '@app/dtos/CommentDto';
import type { Comment } from '@domain/entities/Comment';

export class CommentService {
  constructor(private commentRepository: ICommentRepository) {}

  async createComment(dto: CreateCommentDto): Promise<CommentDto> {
    const comment = await this.commentRepository.create(dto);
    return this.toDto(comment);
  }

  async getCommentById(id: string): Promise<CommentDto | null> {
    const comment = await this.commentRepository.findById(id);
    return comment ? this.toDto(comment) : null;
  }

  async getCommentsByArticle(articleId: string): Promise<CommentDto[]> {
    const comments = await this.commentRepository.findByArticleId(articleId);
    return comments.map(this.toDto);
  }

  async updateComment(id: string, dto: UpdateCommentDto): Promise<CommentDto | null> {
    const comment = await this.commentRepository.update(id, dto);
    return comment ? this.toDto(comment) : null;
  }

  async deleteComment(id: string): Promise<void> {
    return this.commentRepository.delete(id);
  }

  private toDto = (comment: Comment): CommentDto => ({
    id: comment.id,
    articleId: comment.articleId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  });
}
