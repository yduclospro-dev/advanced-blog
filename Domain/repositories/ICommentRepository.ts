import type { Comment } from '@domain/entities/Comment';

export interface ICommentRepository {
  create(data: Partial<Comment>): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findByArticleId(articleId: string): Promise<Comment[]>;
  update(id: string, data: Partial<Comment>): Promise<Comment | null>;
  delete(id: string): Promise<void>;
}
