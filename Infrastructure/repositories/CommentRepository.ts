
import type { ICommentRepository } from '@domain/repositories/ICommentRepository';
import type { Comment } from '@domain/entities/Comment';
import { prisma } from "@infra/prismaClient";

export class CommentRepository implements ICommentRepository {
  async create(data: Partial<Comment>): Promise<Comment> {
    const created = await prisma.comment.create({
      data: {
        articleId: data.articleId!,
        userId: data.userId!,
        content: data.content!,
      },
    });
    return {
      id: created.id,
      articleId: created.articleId,
      userId: created.userId,
      content: created.content,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findById(id: string): Promise<Comment | null> {
    const found = await prisma.comment.findUnique({
      where: { id },
    });
    if (!found) return null;
    return {
      id: found.id,
      articleId: found.articleId,
      userId: found.userId,
      content: found.content,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    };
  }

  async findByArticleId(articleId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'asc' },
    });
    return comments.map((c) => ({
      id: c.id,
      articleId: c.articleId,
      userId: c.userId,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async update(id: string, data: Partial<Comment>): Promise<Comment | null> {
    const updated = await prisma.comment.update({
      where: { id },
      data: {
        ...(data.content && { content: data.content }),
      },
    });
    return {
      id: updated.id,
      articleId: updated.articleId,
      userId: updated.userId,
      content: updated.content,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
