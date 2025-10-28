import { Article } from "@/types/Article";
import { Comment } from "@/types/Comment";
import ConfirmModal from "@/components/ConfirmModal";
import { Button, ButtonLink, Card, LikeDislikeButtons } from "@/components/ui";
import CommentsListContainer from "../comments/containers/CommentsListContainer";
import CommentFormContainer from "../comments/containers/CommentFormContainer";
import { isValidImageDataUrl } from "@/utils/imageValidation";
import Image from "next/image";

interface ArticleDetailPresenterProps {
    article: Article;
    isAuthenticated: boolean;
    isAuthor: boolean;
    showConfirm: boolean;
    onDelete: () => void;
    onCancelDelete: () => void;
    onShowConfirm: () => void;
    onBack: () => void;
    comments: Comment[];
    currentUserId?: string;
    onAddComment: (content: string) => void;
    onUpdateComment: (commentId: string, content: string) => void;
    onDeleteComment: (commentId: string) => void;
    onArticleLike: () => void;
    onArticleDislike: () => void;
    onCommentLike: (commentId: string) => void;
    onCommentDislike: (commentId: string) => void;
}

export default function ArticleDetailPresenter({
    article,
    isAuthenticated,
    isAuthor,
    showConfirm,
    onDelete,
    onCancelDelete,
    onShowConfirm,
    onBack,
    comments,
    currentUserId,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
    onArticleLike,
    onArticleDislike,
    onCommentLike,
    onCommentDislike,
}: ArticleDetailPresenterProps) {
    return (
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen py-16 px-6 md:px-20 lg:px-32 transition-colors">
            <Card variant="default" padding="lg" className="max-w-3xl mx-auto relative">
                <div className="mb-6 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-sm"
                        label="← Retour à la liste"
                    />

                    {isAuthenticated && isAuthor && (
                        <div className="flex gap-3">
                            <ButtonLink
                                href={`/articles/${article.id}/edit`}
                                variant="primary"
                                className="p-2.5"
                                label=""
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                }
                            />
                            <Button
                                variant="danger"
                                onClick={onShowConfirm}
                                className="p-2.5"
                                label=""
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                            />
                        </div>
                    )}
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

                    {article.imageUrl && isValidImageDataUrl(article.imageUrl) && (
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

                    {isAuthenticated && (
                        <div className="mt-8 flex justify-center">
                            <LikeDislikeButtons
                                likesCount={article.likes.length}
                                dislikesCount={article.dislikes.length}
                                hasLiked={currentUserId ? article.likes.includes(currentUserId) : false}
                                hasDisliked={currentUserId ? article.dislikes.includes(currentUserId) : false}
                                onLike={onArticleLike}
                                onDislike={onArticleDislike}
                            />
                        </div>
                    )}
                </article>

                <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-slate-700">
                    {isAuthenticated ? (
                        <div className="mb-8">
                            <CommentFormContainer onSubmit={onAddComment} />
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
                        onDelete={onDeleteComment}
                        onUpdate={onUpdateComment}
                        onLike={onCommentLike}
                        onDislike={onCommentDislike}
                    />
                </div>
            </Card>

            {showConfirm && (
                <ConfirmModal
                    message="Cette action est irréversible."
                    onConfirm={onDelete}
                    onCancel={onCancelDelete}
                />
            )}
        </div>
    );
}
