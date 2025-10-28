"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useArticleStore } from "@/stores/articlesStore";
import { useUserStore } from "@/stores/userStore";
import ForbiddenAccess from "@/components/ForbiddenAccess";
import NewArticlePresenter from "../presenters/NewArticlePresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import ClientOnly from "@/components/ClientOnly";

export default function NewArticleContainer() {
    const router = useRouter();
    const { safeAddArticle } = useArticleStore();
    const { currentUser } = useUserStore();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
    });

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (imageUrl: string | null) => {
        setFormData(prev => ({ ...prev, imageUrl: imageUrl || "" }));
    };

    const handleImageError = (message: string) => {
        setToast({ message, type: "error" });
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            setToast({ message: "Le titre et le contenu sont requis !", type: "error" });
            return;
        }

        if (!currentUser) {
            setToast({ message: "Erreur : utilisateur non connecté", type: "error" });
            return;
        }

        const newArticle = {
            title: formData.title,
            content: formData.content,
            imageUrl: formData.imageUrl || undefined,
            author: currentUser.username,
            authorId: currentUser.id,
        };

        try {
            await safeAddArticle(newArticle);
            setToast({ message: "Article créé avec succès !", type: "success" });
            
            setTimeout(() => {
                router.push("/articles");
            }, 1500);
        } catch (error) {
            setToast({ 
                message: error instanceof Error ? error.message : "Erreur lors de la création de l'article", 
                type: "error" 
            });
        }
    };

    const handleCancel = () => {
        router.push("/articles");
    };

    if (!currentUser) {
        return (
            <ForbiddenAccess 
                message="Vous devez être connecté pour créer un nouvel article."
            />
        );
    }

    return (
        <>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            <ClientOnly fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
                    <p className="text-gray-500">Chargement...</p>
                </div>
            }>
                <NewArticlePresenter
                    formData={formData}
                    onInputChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onImageError={handleImageError}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </ClientOnly>
        </>
    );
}
