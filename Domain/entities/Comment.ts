export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
