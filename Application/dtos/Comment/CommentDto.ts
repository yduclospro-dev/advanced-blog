export interface CreateCommentDto {
  articleId: string;
  userId?: string; // sera injecté côté controller
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentDto {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
