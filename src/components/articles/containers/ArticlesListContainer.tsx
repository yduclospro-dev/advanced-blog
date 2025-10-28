"use client";

import { useArticleStore } from "@/stores/articlesStore";
import { useUserStore } from "@/stores/userStore";
import ArticlesListPresenter from "../presenters/ArticlesListPresenter";
import ClientOnly from "@/components/ClientOnly";

export default function ArticlesListContainer() {
    const { articles } = useArticleStore();
    const { isAuthenticated } = useUserStore();

    return (
        <ClientOnly fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
                <p className="text-gray-500">Chargement...</p>
            </div>
        }>
            <ArticlesListPresenter 
                articles={articles}
                isAuthenticated={isAuthenticated}
            />
        </ClientOnly>
    );
}
