"use client";

import { useParams, useRouter } from "next/navigation";
import { useArticleStore } from "@/stores/articlesStore";
import { useCommentsStore } from "@/stores/commentsStore";
import { useUserStore } from "@/stores/userStore";
import { useState, useEffect } from "react";
import ArticleDetailPresenter from "../presenters/ArticleDetailPresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import ClientOnly from "@/components/ClientOnly";
import { useUiStore } from "@/stores/uiStore";

export default function ArticleDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const { getArticleById, toggleArticleLike, toggleArticleDislike, fetchArticles } = useArticleStore();
    const isLoading = useUiStore((state) => state.isLoading('articles'));
    const currentUser = useUserStore((state) => state.currentUser);
    const { 
        getCommentsByArticle, 
        addComment, 
        updateComment, 
        deleteComment,
        toggleCommentLike,
        toggleCommentDislike
    } = useCommentsStore();
    
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const article = getArticleById(String(id));
    const comments = article ? getCommentsByArticle(article.id) : [];

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleBack = () => {
        router.push("/articles");
    };

    const handleAddComment = (content: string) => {
        if (!article || !currentUser) return;
        
        addComment({
            articleId: article.id,
            authorId: currentUser.id,
            authorName: currentUser.userName,
            content,
        });
        setToast({ message: "Commentaire ajouté avec succès !", type: "success" });
    };

    const handleUpdateComment = (commentId: string, content: string) => {
        updateComment(commentId, content);
        setToast({ message: "Commentaire modifié avec succès !", type: "success" });
    };

    const handleDeleteComment = (commentId: string) => {
        deleteComment(commentId);
        setToast({ message: "Commentaire supprimé avec succès !", type: "success" });
    };

    const handleArticleLike = () => {
        if (!article || !currentUser) return;
        toggleArticleLike(article.id, currentUser.id);
    };

    const handleArticleDislike = () => {
        if (!article || !currentUser) return;
        toggleArticleDislike(article.id, currentUser.id);
    };

    const handleCommentLike = (commentId: string) => {
        if (!currentUser) return;
        toggleCommentLike(commentId, currentUser.id);
    };

    const handleCommentDislike = (commentId: string) => {
        if (!currentUser) return;
        toggleCommentDislike(commentId, currentUser.id);
    };

    if (isLoading || !article) {
        return (
            <ClientOnly fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                    <p className="text-center text-gray-500 text-lg">Chargement...</p>
                </div>
            }>
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
                    <p className="text-center text-gray-500 dark:text-slate-400 text-lg">
                        {isLoading ? "Chargement de l'article..." : "Article introuvable."}
                    </p>
                </div>
            </ClientOnly>
        );
    }

    return (
        <>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            <ClientOnly fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                    <p className="text-center text-gray-500 text-lg">Chargement...</p>
                </div>
            }>
                <ArticleDetailPresenter
                    article={article}
                    isAuthenticated={!!currentUser}
                    currentUserId={currentUser?.id}
                    onBack={handleBack}
                    comments={comments}
                    commentHandlers={{
                        onAdd: handleAddComment,
                        onUpdate: handleUpdateComment,
                        onDelete: handleDeleteComment,
                        onLike: handleCommentLike,
                        onDislike: handleCommentDislike,
                    }}
                    articleLikeHandlers={{
                        onLike: handleArticleLike,
                        onDislike: handleArticleDislike,
                    }}
                />
            </ClientOnly>
        </>
    );
}
