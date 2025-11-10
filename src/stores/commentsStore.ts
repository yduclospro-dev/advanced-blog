"use client";

import { create } from "zustand";
import { Comment } from "@/types/Comment";
import axiosInstance from "@/utils/axios";
import { isAxiosError } from "axios";
import { useUiStore } from "@/stores/uiStore";

interface CommentsStore {
    comments: Comment[];
    error: string | null;
    fetchComments: (articleId: string) => Promise<void>;
    addComment: (articleId: string, content: string) => Promise<void>;
    updateComment: (id: string, content: string) => Promise<void>;
    deleteComment: (id: string) => Promise<void>;
}

export const useCommentsStore = create<CommentsStore>()((set, get) => ({
    comments: [],
    error: null,

    fetchComments: async (articleId: string) => {
        useUiStore.getState().setLoading('comments', true);
        set({ error: null });
        try {
            const res = await axiosInstance.get<Comment[]>(`/articles/${articleId}/comments`);
            set({ comments: res.data });
        } catch (e: unknown) {
            if (isAxiosError(e)) {
                set({ error: e.response?.data?.error || 'Erreur lors du chargement des commentaires' });
            } else {
                set({ error: 'Erreur lors du chargement des commentaires' });
            }
        } finally {
            useUiStore.getState().setLoading('comments', false);
        }
    },


    addComment: async (articleId: string, content: string) => {
        set({ error: null });
        try {
            const res = await axiosInstance.post<Comment>(`/articles/${articleId}/comments`, { content });
            set({ comments: [...get().comments, res.data] });
        } catch (e: unknown) {
            if (isAxiosError(e)) {
                set({ error: e.response?.data?.error || "Erreur lors de l'ajout du commentaire" });
            } else {
                set({ error: "Erreur lors de l'ajout du commentaire" });
            }
        }
    },


    updateComment: async (id: string, content: string) => {
        set({ error: null });
        try {
            const res = await axiosInstance.put<Comment>(`/comments/${id}`, { content });
            set({ comments: get().comments.map((c) => (c.id === id ? res.data : c)) });
        } catch (e: unknown) {
            if (isAxiosError(e)) {
                set({ error: e.response?.data?.error || 'Erreur lors de la modification' });
            } else {
                set({ error: 'Erreur lors de la modification' });
            }
        }
    },

    deleteComment: async (id: string) => {
        set({ error: null });
        try {
            await axiosInstance.delete(`/comments/${id}`);
            set({ comments: get().comments.filter((c) => c.id !== id) });
        } catch (e: unknown) {
            if (isAxiosError(e)) {
                set({ error: e.response?.data?.error || 'Erreur lors de la suppression' });
            } else {
                set({ error: 'Erreur lors de la suppression' });
            }
        }
    },
}));
