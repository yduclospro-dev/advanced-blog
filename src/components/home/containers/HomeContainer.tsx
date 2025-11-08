"use client";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useArticleStore } from "@/stores/articlesStore";
import HomePresenter from "../presenters/HomePresenter";
import ClientOnly from "@/components/ClientOnly";
import { useUiStore } from "@/stores/uiStore";

export default function HomeContainer() {
  const currentUser = useUserStore((state) => state.currentUser);
  const { getLatestArticles, fetchArticles } = useArticleStore();
  const isLoading = useUiStore((state) => state.isLoading('articles'));

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const featuredArticles = getLatestArticles(3);

  return (
    <ClientOnly fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-gray-500">Chargement...</p>
      </div>
    }>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
          <p className="text-gray-500">Chargement des articles...</p>
        </div>
      ) : (
        <HomePresenter
          currentUser={currentUser}
          featuredArticles={featuredArticles}
        />
      )}
    </ClientOnly>
  );
}