import type { IArticleRepository } from '../../Domain/repositories/IArticleRepository.ts';
import { Article } from '../../Domain/entities/Article.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ArticleRepository implements IArticleRepository {
  async create(article: Article): Promise<Article> {
    const created = await prisma.article.create({
      data: {
        title: article.title,
        authorId: article.authorId,
        content: article.content
      },
      include: {
        user: true,
      },
    });

    return new Article(
      created.title,
      created.user.userName,
      created.authorId,
      created.date.toISOString().split('T')[0],
      created.content,
      created.id,
    );
  }

  async findAll(): Promise<Article[]> {
    const articles = await prisma.article.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        user: true,
      },
    });

    return articles.map(
      (a) =>
        new Article(
          a.id,
          a.title,
          a.user.userName,
          a.authorId,
          a.date.toISOString().split('T')[0],
          a.content
        )
    );
  }

  async findById(id: string): Promise<Article | null> {
    const found = await prisma.article.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!found) return null;

    return new Article(
      found.id,
      found.title,
      found.user.userName,
      found.authorId,
      found.date.toISOString().split('T')[0],
      found.content
    );
  }

  async update(id: string, articleData: Partial<Article>): Promise<Article> {
    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(articleData.title && { title: articleData.title }),
        ...(articleData.content && { content: articleData.content }),
      },
      include: {
        user: true,
      },
    });

    return new Article(
      updated.title,
      updated.user.userName,
      updated.authorId,
      updated.date.toISOString().split('T')[0],
      updated.content,
      updated.id,
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.article.delete({ where: { id } });
  }
}

