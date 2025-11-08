import { Article } from "@/types/Article";
import { Card, Button } from "@/components/ui";
import Image from "next/image";

interface Props {
    article: Article;
    canManage?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function ArticleCard({ article, canManage = false, onEdit, onDelete }: Props) {
    const preview =
        article.content.length > 120
            ? article.content.slice(0, 120) + "..."
            : article.content;

    return (
        <Card variant="default" padding="none" hover className="overflow-hidden flex flex-col">
            {article.imageUrl ? (
                <div className="h-32 w-full overflow-hidden relative">
                    <Image 
                        src={article.imageUrl} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ) : (
                <div className="h-32 w-full bg-linear-to-r from-blue-400 to-blue-300"></div>
            )}

            <div className="p-5 flex flex-col justify-between grow">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {article.title}
                    </h2>
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-snug">{preview}</p>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                                {article.author}
                            </span>
                        </div>

                        <span className="text-xs text-gray-500 dark:text-slate-400">
                            {new Date(article.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    {canManage && (
                        <div 
                            className="flex gap-2 justify-around pt-2 border-t border-gray-200 dark:border-slate-700"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Button
                                variant="primary"
                                label=""
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                }
                                onClick={() => onEdit?.(article.id)}
                                className="p-2.5"
                            />
                            <Button
                                variant="danger"
                                label=""
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                                onClick={() => onDelete?.(article.id)}
                                className="p-2.5"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
