export interface Article {
    id: string;
    title: string;
    author: string;
    authorId: string;
    date: string;
    content: string;
    imageUrl?: string;
    likes: string[];
    dislikes: string[];
}
