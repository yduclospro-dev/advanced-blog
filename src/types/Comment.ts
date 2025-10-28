export interface Comment {
    id: string;
    articleId: string;
    authorId: string;
    authorName: string;
    content: string;
    date: string;
    likes: string[];
    dislikes: string[];
}
