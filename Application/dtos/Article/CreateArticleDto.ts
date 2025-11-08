export type CreateArticleDto = {
  id: string;
  title: string;
  author: string;
  content: string;
  imageUrl?: string;
};