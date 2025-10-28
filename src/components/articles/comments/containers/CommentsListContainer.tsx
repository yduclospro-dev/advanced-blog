"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types/Comment";
import CommentsListPresenter from "../presenters/CommentsListPresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";

interface CommentsListContainerProps {
    comments: Comment[];
    currentUserId?: string;
    onDelete: (commentId: string) => void;
    onUpdate: (commentId: string, content: string) => void;
    onLike: (commentId: string) => void;
    onDislike: (commentId: string) => void;
}

export default function CommentsListContainer({
    comments,
    currentUserId,
    onDelete,
    onUpdate,
    onLike,
    onDislike,
}: CommentsListContainerProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        document.body.style.overflow = deleteConfirmId ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [deleteConfirmId]);

    const handleStartEditing = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEditing = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleEditContentChange = (value: string) => {
        setEditContent(value);
    };

    const handleSaveEdit = (commentId: string) => {
        if (!editContent.trim()) {
            setToast({ message: "Le commentaire ne peut pas être vide !", type: "error" });
            return;
        }
        onUpdate(commentId, editContent);
        handleCancelEditing();
    };

    const handleShowDeleteConfirm = (commentId: string) => {
        setDeleteConfirmId(commentId);
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmId) {
            onDelete(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmId(null);
    };

    return (
        <>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            <CommentsListPresenter
                comments={comments}
                currentUserId={currentUserId}
                editingId={editingId}
                editContent={editContent}
                deleteConfirmId={deleteConfirmId}
                onStartEditing={handleStartEditing}
                onCancelEditing={handleCancelEditing}
                onEditContentChange={handleEditContentChange}
                onSaveEdit={handleSaveEdit}
                onShowDeleteConfirm={handleShowDeleteConfirm}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
                onCommentLike={onLike}
                onCommentDislike={onDislike}
            />
        </>
    );
}
