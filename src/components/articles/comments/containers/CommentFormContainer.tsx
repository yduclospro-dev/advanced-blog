"use client";

import { useState } from "react";
import CommentFormPresenter from "../presenters/CommentFormPresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";

interface CommentFormContainerProps {
    onSubmit: (content: string) => void;
}

export default function CommentFormContainer({ onSubmit }: CommentFormContainerProps) {
    const [content, setContent] = useState("");
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const handleInputChange = (value: string) => {
        setContent(value);
    };

    const handleSubmit = () => {
        if (!content.trim()) {
            setToast({ message: "Le commentaire ne peut pas être vide !", type: "error" });
            return;
        }
        onSubmit(content);
        setContent("");
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
            <CommentFormPresenter
                content={content}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
            />
        </>
    );
}
