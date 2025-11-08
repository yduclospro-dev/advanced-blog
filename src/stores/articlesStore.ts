"use client";

import { create } from "zustand";
import { Article } from "@/types/Article";

const API_URL = "/api/articles";

interface ArticleStore {
    articles: Article[];
    isLoading: boolean;
    error: string | null;
    fetchArticles: () => Promise<void>;
    getArticleById: (id: string) => Article | undefined;
    getLatestArticles: (limit: number) => Article[];
    addArticle: (articleData: Omit<Article, "id" | "date" | "authorId">) => Promise<void>;
    updateArticle: (id: string, updatedData: Partial<Article>) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    toggleArticleLike: (articleId: string, userId: string) => void;
    toggleArticleDislike: (articleId: string, userId: string) => void;
    safeAddArticle: (articleData: Omit<Article, "id" | "date" | "authorId">) => Promise<void>;
    safeUpdateArticle: (id: string, updatedData: Partial<Article>) => Promise<void>;
}

export const useArticleStore = create<ArticleStore>()((set, get) => ({
    articles: [],
    isLoading: false,
    error: null,

    fetchArticles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
            const articles = await response.json();
            
            const articlesWithLikes = articles.map((article: Article) => ({
                ...article,
                likes: JSON.parse(localStorage.getItem(`article-${article.id}-likes`) || "[]"),
                dislikes: JSON.parse(localStorage.getItem(`article-${article.id}-dislikes`) || "[]"),
            }));
            
            set({ articles: articlesWithLikes, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    getArticleById: (id) => get().articles.find((a) => a.id === id),
    
    getLatestArticles: (limit) => {
        const sorted = [...get().articles].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return sorted.slice(0, limit);
    },

    addArticle: async (articleData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: articleData.title.trim(),
                    author: articleData.author.trim(),
                    content: articleData.content.trim(),
                    imageUrl: articleData.imageUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erreur lors de la création de l'article");
            }

            const newArticle = await response.json();
            const articleWithLikes = {
                ...newArticle,
                likes: [],
                dislikes: [],
            };
            
            set({ 
                articles: [...get().articles, articleWithLikes],
                isLoading: false 
            });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    updateArticle: async (id, updatedData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(updatedData.title && { title: updatedData.title.trim() }),
                    ...(updatedData.content && { content: updatedData.content.trim() }),
                    ...(updatedData.imageUrl !== undefined && { imageUrl: updatedData.imageUrl }),
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'article");

            const updatedArticle = await response.json();
            const currentArticle = get().articles.find(a => a.id === id);
            
            set({
                articles: get().articles.map((a) =>
                    a.id === id ? {
                        ...updatedArticle,
                        likes: currentArticle?.likes || [],
                        dislikes: currentArticle?.dislikes || [],
                    } : a
                ),
                isLoading: false,
            });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    deleteArticle: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression de l'article");

            localStorage.removeItem(`article-${id}-likes`);
            localStorage.removeItem(`article-${id}-dislikes`);

            set({
                articles: get().articles.filter((a) => a.id !== id),
                isLoading: false,
            });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    toggleArticleLike: (articleId, userId) => {
        set({
            articles: get().articles.map((article) => {
                if (article.id !== articleId) return article;
                
                const hasLiked = article.likes?.includes(userId) || false;
                const hasDisliked = article.dislikes?.includes(userId) || false;
                
                const newLikes = hasLiked 
                    ? article.likes?.filter(id => id !== userId) || []
                    : [...(article.likes || []), userId];
                const newDislikes = hasDisliked
                    ? article.dislikes?.filter(id => id !== userId) || []
                    : article.dislikes || [];

                localStorage.setItem(`article-${articleId}-likes`, JSON.stringify(newLikes));
                localStorage.setItem(`article-${articleId}-dislikes`, JSON.stringify(newDislikes));

                return {
                    ...article,
                    likes: newLikes,
                    dislikes: newDislikes,
                };
            }),
        });
    },

    toggleArticleDislike: (articleId, userId) => {
        set({
            articles: get().articles.map((article) => {
                if (article.id !== articleId) return article;
                
                const hasLiked = article.likes?.includes(userId) || false;
                const hasDisliked = article.dislikes?.includes(userId) || false;
                
                const newLikes = hasLiked
                    ? article.likes?.filter(id => id !== userId) || []
                    : article.likes || [];
                const newDislikes = hasDisliked
                    ? article.dislikes?.filter(id => id !== userId) || []
                    : [...(article.dislikes || []), userId];

                localStorage.setItem(`article-${articleId}-likes`, JSON.stringify(newLikes));
                localStorage.setItem(`article-${articleId}-dislikes`, JSON.stringify(newDislikes));

                return {
                    ...article,
                    likes: newLikes,
                    dislikes: newDislikes,
                };
            }),
        });
    },

    safeAddArticle: async (articleData) => {
        return get().addArticle(articleData);
    },

    safeUpdateArticle: async (id, updatedData) => {
        return get().updateArticle(id, updatedData);
    },
}));
