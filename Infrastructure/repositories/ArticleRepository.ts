import type { IArticleRepository } from '../../Domain/repositories/IArticleRepository.ts';
import { Article } from '../../Domain/entities/Article.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ArticleRepository implements IArticleRepository {
  async create(article: Article): Promise<Article> {
    const created = await prisma.article.create({
      data: {
        title: article.title,
        author: article.author,
        authorId: article.authorId,
        content: article.content,
        likes: article.likes,
        dislikes: article.dislikes,
      },
    });
    
    return new Article(
      created.id,
      created.title,
      created.author,
      created.authorId,
      created.date.toISOString().split('T')[0],
      created.content,
      created.likes,
      created.dislikes,
      article.imageUrl
    );
  }

  async findAll(): Promise<Article[]> {
    const articles = await prisma.article.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    
    return articles.map(
      (a) =>
        new Article(
          a.id,
          a.title,
          a.author,
          a.authorId,
          a.date.toISOString().split('T')[0],
          a.content,
          a.likes,
          a.dislikes
        )
    );
  }

  async findById(id: string): Promise<Article | null> {
    const found = await prisma.article.findUnique({ where: { id } });
    if (!found) return null;
    
    return new Article(
      found.id,
      found.title,
      found.author,
      found.authorId,
      found.date.toISOString().split('T')[0],
      found.content,
      found.likes,
      found.dislikes
    );
  }

  async update(id: string, articleData: Partial<Article>): Promise<Article> {
    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(articleData.title && { title: articleData.title }),
        ...(articleData.content && { content: articleData.content }),
        ...(articleData.likes && { likes: articleData.likes }),
        ...(articleData.dislikes && { dislikes: articleData.dislikes }),
      },
    });
    
    return new Article(
      updated.id,
      updated.title,
      updated.author,
      updated.authorId,
      updated.date.toISOString().split('T')[0],
      updated.content,
      updated.likes,
      updated.dislikes,
      articleData.imageUrl
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.article.delete({ where: { id } });
  }

  async toggleLike(articleId: string, userId: string): Promise<Article> {
    const article = await this.findById(articleId);
    if (!article) {
      throw new Error('Article non trouvé');
    }

    article.toggleLike(userId);

    return this.update(articleId, {
      likes: article.likes,
      dislikes: article.dislikes,
    });
  }

  async toggleDislike(articleId: string, userId: string): Promise<Article> {
    const article = await this.findById(articleId);
    if (!article) {
      throw new Error('Article non trouvé');
    }

    article.toggleDislike(userId);

    return this.update(articleId, {
      likes: article.likes,
      dislikes: article.dislikes,
    });
  }
}
