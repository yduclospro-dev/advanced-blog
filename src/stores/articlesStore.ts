"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Article } from "@/types/Article";
import { isQuotaExceededError } from "@/utils/imageValidation";

interface ArticleStore {
    articles: Article[];
    getArticleById: (id: string) => Article | undefined;
    getLatestArticles: (limit: number) => Article[];
    addArticle: (articleData: Omit<Article, "id" | "date" | "likes" | "dislikes">) => void;
    updateArticle: (id: string, updatedData: Partial<Article>) => void;
    deleteArticle: (id: string) => void;
    toggleArticleLike: (articleId: string, userId: string) => void;
    toggleArticleDislike: (articleId: string, userId: string) => void;
    safeAddArticle: (articleData: Omit<Article, "id" | "date" | "likes" | "dislikes">) => Promise<void>;
    safeUpdateArticle: (id: string, updatedData: Partial<Article>) => Promise<void>;
}

export const useArticleStore = create<ArticleStore>()(
    persist(
        (set, get) => ({
            articles: [],
            getArticleById: (id) => get().articles.find((a) => a.id === id),
            getLatestArticles: (limit) => {
                const sorted = [...get().articles].sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                return sorted.slice(0, limit);
            },
            addArticle: (articleData) => {
                const newArticle: Article = {
                    ...articleData,
                    title: articleData.title.trim(),
                    content: articleData.content.trim(),
                    author: articleData.author.trim(),
                    id: crypto.randomUUID(),
                    date: new Date().toISOString().split("T")[0],
                    likes: [],
                    dislikes: [],
                };
                set({ articles: [...get().articles, newArticle] });
            },
            updateArticle: (id, updatedData) =>
                set({
                    articles: get().articles.map((a) =>
                        a.id === id ? { 
                            ...a, 
                            ...updatedData,
                            ...(updatedData.title && { title: updatedData.title.trim() }),
                            ...(updatedData.content && { content: updatedData.content.trim() }),
                        } : a
                    ),
                }),
            deleteArticle: (id) =>
                set({ articles: get().articles.filter((a) => a.id !== id) }),
            toggleArticleLike: (articleId, userId) => {
                set({
                    articles: get().articles.map((article) => {
                        if (article.id !== articleId) return article;
                        
                        const hasLiked = article.likes.includes(userId);
                        const hasDisliked = article.dislikes.includes(userId);
                        
                        return {
                            ...article,
                            likes: hasLiked 
                                ? article.likes.filter(id => id !== userId)
                                : [...article.likes, userId],
                            dislikes: hasDisliked
                                ? article.dislikes.filter(id => id !== userId)
                                : article.dislikes,
                        };
                    }),
                });
            },
            toggleArticleDislike: (articleId, userId) => {
                set({
                    articles: get().articles.map((article) => {
                        if (article.id !== articleId) return article;
                        
                        const hasLiked = article.likes.includes(userId);
                        const hasDisliked = article.dislikes.includes(userId);
                        
                        return {
                            ...article,
                            likes: hasLiked
                                ? article.likes.filter(id => id !== userId)
                                : article.likes,
                            dislikes: hasDisliked
                                ? article.dislikes.filter(id => id !== userId)
                                : [...article.dislikes, userId],
                        };
                    }),
                });
            },
            safeAddArticle: async (articleData) => {
                try {
                    const newArticle: Article = {
                        ...articleData,
                        title: articleData.title.trim(),
                        content: articleData.content.trim(),
                        author: articleData.author.trim(),
                        id: crypto.randomUUID(),
                        date: new Date().toISOString().split("T")[0],
                        likes: [],
                        dislikes: [],
                    };
                    set({ articles: [...get().articles, newArticle] });
                } catch (error) {
                    if (isQuotaExceededError(error)) {
                        throw new Error("Image trop volumineuse. Utilisez une image plus petite.");
                    }
                    throw error;
                }
            },
            safeUpdateArticle: async (id, updatedData) => {
                try {
                    set({
                        articles: get().articles.map((a) =>
                            a.id === id ? { 
                                ...a, 
                                ...updatedData,
                                ...(updatedData.title && { title: updatedData.title.trim() }),
                                ...(updatedData.content && { content: updatedData.content.trim() }),
                            } : a
                        ),
                    });
                } catch (error) {
                    if (isQuotaExceededError(error)) {
                        throw new Error("Image trop volumineuse. Utilisez une image plus petite.");
                    }
                    throw error;
                }
            },
        }),
        { name: "articles-storage" }
    )
);
