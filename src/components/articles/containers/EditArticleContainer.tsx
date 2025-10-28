"use client";

import { useParams, useRouter } from "next/navigation";
import { useArticleStore } from "@/stores/articlesStore";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";
import ForbiddenAccess from "@/components/ForbiddenAccess";
import EditArticlePresenter from "../presenters/EditArticlePresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import ClientOnly from "@/components/ClientOnly";

export default function EditArticleContainer() {
  const { id } = useParams();
  const router = useRouter();
  const { getArticleById, safeUpdateArticle } = useArticleStore();
  const { currentUser } = useUserStore();

  const article = getArticleById(String(id));
  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    imageUrl: article?.imageUrl || "",
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
    if (article) {
      try {
        await safeUpdateArticle(article.id, {
          title: formData.title,
          content: formData.content,
          imageUrl: formData.imageUrl || undefined
        });
        setToast({ message: "Article modifié avec succès !", type: "success" });
        
        setTimeout(() => {
          router.push(`/articles/${article.id}`);
        }, 1500);
      } catch (error) {
        setToast({ 
          message: error instanceof Error ? error.message : "Erreur lors de la modification de l'article", 
          type: "error" 
        });
      }
    }
  };

  const handleCancel = () => {
    if (article) {
      router.push(`/articles/${article.id}`);
    }
  };

  if (!currentUser) {
    return (
      <ForbiddenAccess 
        message="Vous devez être connecté pour modifier cet article."
      />
    );
  }

  if (!article) {
    return (
      <ClientOnly fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
          <p className="text-center text-gray-500 text-lg">Chargement...</p>
        </div>
      }>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
          <p className="text-center text-gray-500 dark:text-slate-400 text-lg">Article introuvable.</p>
        </div>
      </ClientOnly>
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
        <EditArticlePresenter
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
