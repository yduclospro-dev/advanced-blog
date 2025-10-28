"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui";

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        setVisible(true);
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card 
                variant="modal" 
                padding="lg"
                className={`w-[90%] max-w-md text-center transform transition-all duration-300 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Supprimer cet article ?</h2>
                <p className="text-gray-700 dark:text-slate-300 mb-6">{message}</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-md border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-md bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 transition cursor-pointer"
                    >
                        Supprimer
                    </button>
                </div>
            </Card>
        </div>
    );
}
