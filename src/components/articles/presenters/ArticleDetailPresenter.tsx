import { Article } from "@/types/Article";
import { Comment } from "@/types/Comment";
import { Button, Card } from "@/components/ui";
import CommentsListContainer from "../comments/containers/CommentsListContainer";
import CommentFormContainer from "../comments/containers/CommentFormContainer";
import Image from "next/image";

interface CommentHandlers {
    onAdd: (content: string) => void;
    onUpdate: (commentId: string, content: string) => void;
    onDelete: (commentId: string) => void;
}



interface ArticleDetailPresenterProps {
    article: Article;
    isAuthenticated: boolean;
    currentUserId?: string;
    onBack: () => void;
    comments: Comment[];
    commentHandlers: CommentHandlers;
}

export default function ArticleDetailPresenter({
    article,
    isAuthenticated,
    currentUserId,
    onBack,
    comments,
    commentHandlers,
}: ArticleDetailPresenterProps) {
    return (
        <div className="bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen py-16 px-6 md:px-20 lg:px-32 transition-colors">
            <Card variant="default" padding="lg" className="max-w-3xl mx-auto relative">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-sm"
                        label="← Retour à la liste"
                    />
                </div>

                <article>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                        {article.title}
                    </h1>

                    <div className="text-sm text-gray-500 dark:text-slate-400 mb-8 flex justify-between">
                        <span>✍️ {article.author}</span>
                        <span>
                            📅{" "}
                            {new Date(article.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    {article.imageUrl && (
                        <div className="mb-8 rounded-lg overflow-hidden relative w-full h-96">
                            <Image 
                                src={article.imageUrl} 
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                                priority
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none text-justify text-gray-900 dark:text-slate-100">
                        {article.content.split("\n").map((paragraph, i) => (
                            <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                    </div>


                </article>

                <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-slate-700">
                    {isAuthenticated ? (
                        <div className="mb-8">
                            <CommentFormContainer onSubmit={commentHandlers.onAdd} />
                        </div>
                    ) : (
                        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                            <p className="text-blue-800 dark:text-blue-300">
                                🔒 <strong>Connectez-vous</strong> pour ajouter un commentaire
                            </p>
                        </div>
                    )}
                    
                    <CommentsListContainer
                        comments={comments}
                        currentUserId={currentUserId}
                        onDelete={commentHandlers.onDelete}
                        onUpdate={commentHandlers.onUpdate}
                    />
                </div>
            </Card>
        </div>
    );
}
