export interface Comment {
    id: string;
    articleId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    // Optionnel : authorName si tu veux l'afficher, sinon à retirer
    authorName?: string;
}
