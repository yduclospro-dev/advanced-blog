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

export default function ArticleDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const { getArticleById, deleteArticle, toggleArticleLike, toggleArticleDislike } = useArticleStore();
    const { isAuthenticated, currentUser } = useUserStore();
    const { 
        getCommentsByArticle, 
        addComment, 
        updateComment, 
        deleteComment,
        toggleCommentLike,
        toggleCommentDislike
    } = useCommentsStore();
    
    const [showConfirm, setShowConfirm] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const article = getArticleById(String(id));
    const comments = article ? getCommentsByArticle(article.id) : [];

    const isAuthor = !!(article && currentUser?.id === article.authorId);

    useEffect(() => {
        document.body.style.overflow = showConfirm ? "hidden" : "auto";
    }, [showConfirm]);

    const handleDelete = () => {
        if (article) {
            deleteArticle(article.id);
            setShowConfirm(false);
            setToast({ message: "Article supprimé avec succès !", type: "success" });
            
            setTimeout(() => {
                router.push("/articles");
            }, 1500);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const handleShowConfirm = () => {
        setShowConfirm(true);
    };

    const handleBack = () => {
        router.push("/articles");
    };

    const handleAddComment = (content: string) => {
        if (!article || !currentUser) return;
        
        addComment({
            articleId: article.id,
            authorId: currentUser.id,
            authorName: currentUser.username,
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

    if (!article) {
        return (
            <ClientOnly fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                    <p className="text-center text-gray-500 text-lg">Chargement...</p>
                </div>
            }>
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
                    <p className="text-center text-gray-500 dark:text-slate-400 text-lg">Article introuvable.</p>
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
                    isAuthenticated={isAuthenticated}
                    isAuthor={isAuthor}
                    showConfirm={showConfirm}
                    onDelete={handleDelete}
                    onCancelDelete={handleCancelDelete}
                    onShowConfirm={handleShowConfirm}
                    onBack={handleBack}
                    comments={comments}
                    currentUserId={currentUser?.id}
                    onAddComment={handleAddComment}
                    onUpdateComment={handleUpdateComment}
                    onDeleteComment={handleDeleteComment}
                    onArticleLike={handleArticleLike}
                    onArticleDislike={handleArticleDislike}
                    onCommentLike={handleCommentLike}
                    onCommentDislike={handleCommentDislike}
                />
            </ClientOnly>
        </>
    );
}
