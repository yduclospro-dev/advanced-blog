"use client";

import { useRef, useState } from "react";
import { ImageUploadProps } from "./imageUploadTypes";
import Button from "../Button/Button";
import { validateImageFile, isValidImageDataUrl, MAX_FILE_SIZE_MB } from "@/utils/imageValidation";
import Image from "next/image";

export default function ImageUpload({
    value,
    onChange,
    onError,
    placeholder = "Choisir une image",
    className = "",
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.isValid) {
            onError?.(validation.error!);
            return;
        }

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target?.result as string;

                if (!isValidImageDataUrl(base64String)) {
                    onError?.('Format d\'image non valide.');
                    setIsUploading(false);
                    return;
                }

                onChange(base64String);
                setIsUploading(false);
            };
            reader.onerror = () => {
                onError?.('Erreur lors du chargement de l\'image.');
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading image:', error);
            onError?.('Erreur lors du chargement de l\'image.');
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {value && isValidImageDataUrl(value) ? (
                <div className="relative group">
                    <div className="relative w-full h-48 rounded-lg border-2 border-gray-200 dark:border-slate-600 overflow-hidden">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                onClick={handleButtonClick}
                                disabled={isUploading}
                                label="Changer"
                                className="text-sm"
                            />
                            <Button
                                variant="danger"
                                onClick={handleRemoveImage}
                                label="Supprimer"
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-slate-500 transition-colors">
                    <div className="flex flex-col items-center space-y-4">
                        <svg
                            className="w-12 h-12 text-gray-400 dark:text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <div>
                            <Button
                                variant="outline"
                                onClick={handleButtonClick}
                                disabled={isUploading}
                                label={isUploading ? "Chargement..." : placeholder}
                            />
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                                    PNG, JPG, JPEG, GIF, WebP jusqu&#39;à {MAX_FILE_SIZE_MB}MB
                                </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}