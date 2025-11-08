"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useArticleStore } from "@/stores/articlesStore";
import { useUserStore } from "@/stores/userStore";
import ArticlesListPresenter from "../presenters/ArticlesListPresenter";
import ClientOnly from "@/components/ClientOnly";
import ConfirmModal from "@/components/ConfirmModal";

export default function ArticlesListContainer() {
    const router = useRouter();
    const { articles, fetchArticles, isLoading, deleteArticle } = useArticleStore();
    const currentUser = useUserStore((state) => state.currentUser);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleEditArticle = (id: string) => {
        router.push(`/articles/${id}/edit`);
    };

    const handleDeleteArticle = (id: string) => {
        setArticleToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (articleToDelete) {
            await deleteArticle(articleToDelete);
            setShowDeleteModal(false);
            setArticleToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setArticleToDelete(null);
    };

    return (
        <ClientOnly fallback={
            <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
                <p className="text-gray-500">Chargement...</p>
            </div>
        }>
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <p className="text-gray-500">Chargement des articles...</p>
                </div>
            ) : (
                <>
                    <ArticlesListPresenter 
                        articles={articles}
                        isAuthenticated={!!currentUser}
                        currentUserId={currentUser?.id}
                        currentUserRole={currentUser?.role}
                        onEditArticle={handleEditArticle}
                        onDeleteArticle={handleDeleteArticle}
                    />
                    {showDeleteModal && (
                        <ConfirmModal
                            message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    )}
                </>
            )}
        </ClientOnly>
    );
}
