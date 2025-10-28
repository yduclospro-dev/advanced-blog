"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Comment } from "@/types/Comment";

interface CommentsStore {
    comments: Comment[];
    getCommentsByArticle: (articleId: string) => Comment[];
    addComment: (newComment: Omit<Comment, "id" | "date" | "likes" | "dislikes">) => void;
    updateComment: (id: string, content: string) => void;
    deleteComment: (id: string) => void;
    toggleCommentLike: (commentId: string, userId: string) => void;
    toggleCommentDislike: (commentId: string, userId: string) => void;
}

export const useCommentsStore = create<CommentsStore>()(
    persist(
        (set, get) => ({
            comments: [],
            
            getCommentsByArticle: (articleId) => 
                get().comments.filter((c) => c.articleId === articleId),
            
            addComment: (newComment) => {
                const comment: Comment = {
                    ...newComment,
                    content: newComment.content.trim(),
                    authorName: newComment.authorName.trim(),
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    likes: [],
                    dislikes: [],
                };
                set({ comments: [...get().comments, comment] });
            },
            
            updateComment: (id, content) =>
                set({
                    comments: get().comments.map((c) =>
                        c.id === id ? { ...c, content: content.trim() } : c
                    ),
                }),
            
            deleteComment: (id) =>
                set({ 
                    comments: get().comments.filter((c) => c.id !== id) 
                }),
            toggleCommentLike: (commentId, userId) => {
                set({
                    comments: get().comments.map((comment) => {
                        if (comment.id !== commentId) return comment;
                        
                        const hasLiked = comment.likes.includes(userId);
                        const hasDisliked = comment.dislikes.includes(userId);
                        
                        return {
                            ...comment,
                            likes: hasLiked 
                                ? comment.likes.filter(id => id !== userId)
                                : [...comment.likes, userId],
                            dislikes: hasDisliked
                                ? comment.dislikes.filter(id => id !== userId)
                                : comment.dislikes,
                        };
                    }),
                });
            },
            toggleCommentDislike: (commentId, userId) => {
                set({
                    comments: get().comments.map((comment) => {
                        if (comment.id !== commentId) return comment;
                        
                        const hasLiked = comment.likes.includes(userId);
                        const hasDisliked = comment.dislikes.includes(userId);
                        
                        return {
                            ...comment,
                            likes: hasLiked
                                ? comment.likes.filter(id => id !== userId)
                                : comment.likes,
                            dislikes: hasDisliked
                                ? comment.dislikes.filter(id => id !== userId)
                                : [...comment.dislikes, userId],
                        };
                    }),
                });
            },
        }),
        { name: "comments-storage" }
    )
);
