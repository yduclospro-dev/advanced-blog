"use client";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useArticleStore } from "@/stores/articlesStore";
import HomePresenter from "../presenters/HomePresenter";
import ClientOnly from "@/components/ClientOnly";

export default function HomeContainer() {
  const { currentUser, isAuthenticated } = useUserStore();
  const { getLatestArticles, fetchArticles, isLoading } = useArticleStore();

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
          isAuthenticated={isAuthenticated}
          featuredArticles={featuredArticles}
        />
      )}
    </ClientOnly>
  );
}