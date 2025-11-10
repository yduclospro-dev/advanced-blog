"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useArticleStore } from "@/stores/articlesStore";
import { useUserStore } from "@/stores/userStore";
import ArticlesListPresenter from "../presenters/ArticlesListPresenter";
import ClientOnly from "@/components/ClientOnly";
import ConfirmModal from "@/components/ConfirmModal";
import { useUiStore } from "@/stores/uiStore";
export default function ArticlesListContainer() {
    const router = useRouter();
    const { articles, fetchArticles, fetchArticlesSearch, deleteArticle, page, limit, total, setPage } = useArticleStore();
    // Ajoute la gestion du changement de limit
    const setLimit = (newLimit: number) => {
        // On repart à la page 1 si on change la taille
        setPage(1);
        // le useEffect de fetch s'occupera du fetch
    };
    const [searchTerm, setSearchTerm] = useState("");
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const isLoading = useUiStore((state) => state.isLoading('articles'));
    const currentUser = useUserStore((state) => state.currentUser);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (searchTerm.trim()) {
                fetchArticlesSearch(searchTerm, page, limit);
            } else {
                fetchArticles(page, limit);
            }
        }, 400);
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, page, limit]);

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

    // Les articles sont déjà filtrés côté backend si searchTerm est présent
    const filteredArticles = articles;

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
                        articles={filteredArticles}
                        isAuthenticated={!!currentUser}
                        currentUserId={currentUser?.id}
                        currentUserRole={currentUser?.role}
                        onEditArticle={handleEditArticle}
                        onDeleteArticle={handleDeleteArticle}
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={setPage}
                        onLimitChange={setLimit}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
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