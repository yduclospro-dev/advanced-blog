"use client";

import { create } from "zustand";
import { Article } from "@/types/Article";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";
import { useUiStore } from "./uiStore";

const API_URL = "/articles";

interface ArticleStore {
    articles: Article[];
    error: string | null;
    fetchArticles: () => Promise<void>;
    getArticleById: (id: string) => Article | undefined;
    getLatestArticles: (limit: number) => Article[];
    addArticle: (articleData: { title: string; content: string; imageUrl?: string; author?: string; authorId?: string; }) => Promise<void>;
    updateArticle: (id: string, updatedData: Partial<Article>) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    toggleArticleLike: (articleId: string, userId: string) => void;
    toggleArticleDislike: (articleId: string, userId: string) => void;
}

export const useArticleStore = create<ArticleStore>()((set, get) => ({
    articles: [],
    error: null,

    fetchArticles: async () => {
        useUiStore.getState().setLoading('articles', true);
        set({ error: null });
        try {
            const response = await axios.get(API_URL);
            const articles = response.data;
            
            const articlesWithLikes = articles.map((article: Article) => ({
                ...article,
                likes: JSON.parse(localStorage.getItem(`article-${article.id}-likes`) || "[]"),
                dislikes: JSON.parse(localStorage.getItem(`article-${article.id}-dislikes`) || "[]"),
            }));
            
            set({ articles: articlesWithLikes });
            useUiStore.getState().setLoading('articles', false);
        } catch (error: unknown) {
            const errorMessage = isAxiosError(error) 
                ? error.response?.data?.message || error.message 
                : "Erreur lors de la récupération des articles";
            set({ error: errorMessage });
            useUiStore.getState().setLoading('articles', false);
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
        useUiStore.getState().setLoading('articles', true);
        set({ error: null });
        try {
            const payload: { title: string; content: string; imageUrl?: string } = {
                title: articleData.title.trim(),
                content: articleData.content.trim(),
            };

            if (articleData.imageUrl && articleData.imageUrl.trim() !== "") {
                payload.imageUrl = articleData.imageUrl.trim();
            }

            const response = await axios.post(API_URL, payload);

            const newArticle = response.data;
            // Preserve client-provided author/authorId when present (tests may pass them)
            const articleWithLikes = {
                ...newArticle,
                author: articleData.author || newArticle.author,
                authorId: articleData.authorId || newArticle.authorId,
                likes: [],
                dislikes: [],
            };
            
            set({ 
                articles: [...get().articles, articleWithLikes]
            });
            useUiStore.getState().setLoading('articles', false);
        } catch (error: unknown) {
            const errorMessage = isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Erreur lors de la création de l'article";
            set({ error: errorMessage });
            useUiStore.getState().setLoading('articles', false);
            throw new Error(errorMessage);
        }
    },

    updateArticle: async (id, updatedData) => {
        useUiStore.getState().setLoading('articles', true);
        set({ error: null });
        try {
            const response = await axios.put(`${API_URL}/${id}`, {
                ...(updatedData.title && { title: updatedData.title.trim() }),
                ...(updatedData.content && { content: updatedData.content.trim() }),
                ...(updatedData.imageUrl !== undefined && { imageUrl: updatedData.imageUrl }),
            });

            const updatedArticle = response.data;
            const currentArticle = get().articles.find(a => a.id === id);
            
            set({
                articles: get().articles.map((a) =>
                    a.id === id ? {
                        ...updatedArticle,
                        likes: currentArticle?.likes || [],
                        dislikes: currentArticle?.dislikes || [],
                    } : a
                )
            });
            useUiStore.getState().setLoading('articles', false);
        } catch (error: unknown) {
            const errorMessage = isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Erreur lors de la modification de l'article";
            set({ error: errorMessage });
            useUiStore.getState().setLoading('articles', false);
            throw new Error(errorMessage);
        }
    },

    deleteArticle: async (id) => {
        useUiStore.getState().setLoading('articles', true);
        set({ error: null });
        try {
            await axios.delete(`${API_URL}/${id}`);

            localStorage.removeItem(`article-${id}-likes`);
            localStorage.removeItem(`article-${id}-dislikes`);

            set({
                articles: get().articles.filter((a) => a.id !== id)
            });
            useUiStore.getState().setLoading('articles', false);
        } catch (error: unknown) {
            const errorMessage = isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Erreur lors de la suppression de l'article";
            set({ error: errorMessage });
            useUiStore.getState().setLoading('articles', false);
            throw new Error(errorMessage);
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
}));
