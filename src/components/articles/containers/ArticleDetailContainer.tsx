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
    const { getArticleById, fetchArticles } = useArticleStore();
    const isLoading = useUiStore((state) => state.isLoading('articles'));
    const currentUser = useUserStore((state) => state.currentUser);
    const {
        comments,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        error: commentsError
    } = useCommentsStore();
    
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const article = getArticleById(String(id));


    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    useEffect(() => {
        if (article) {
            fetchComments(article.id);
        }
    }, [article, fetchComments]);

    const handleBack = () => {
        router.push("/articles");
    };


    const handleAddComment = async (content: string) => {
        if (!article) return;
        await addComment(article.id, content);
        setToast({ message: "Commentaire ajouté avec succès !", type: "success" });
    };

    const handleUpdateComment = async (commentId: string, content: string) => {
        await updateComment(commentId, content);
        setToast({ message: "Commentaire modifié avec succès !", type: "success" });
    };

    const handleDeleteComment = async (commentId: string) => {
        await deleteComment(commentId);
        setToast({ message: "Commentaire supprimé avec succès !", type: "success" });
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
                    }}
                />
            </ClientOnly>
        </>
    );
}
