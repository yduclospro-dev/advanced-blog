
import Link from "next/link";
import { Article } from "@/types/Article";
import ArticleCard from "@/components/ArticleCard";
import { ButtonLink } from "@/components/ui";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ArticlesListPresenterProps {
    articles: Article[];
    isAuthenticated: boolean;
    currentUserId?: string;
    currentUserRole?: string;
    onEditArticle: (id: string) => void;
    onDeleteArticle: (id: string) => void;
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}


export default function ArticlesListPresenter({
    articles,
    isAuthenticated,
    currentUserId,
    currentUserRole,
    onEditArticle,
    onDeleteArticle,
    page,
    limit,
    total,
    onPageChange,
    onLimitChange,
}: ArticlesListPresenterProps) {
    const totalPages = Math.ceil(total / limit);
    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-16 px-10 md:px-20 lg:px-32 transition-colors">
            <div className="max-w-6xl mx-auto mb-10 lg:hidden">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Articles</h1>
                {isAuthenticated && (
                    <ButtonLink href="/articles/new" variant="primary" label="+ Créer un article" />
                )}
            </div>
            <div className="max-w-6xl mx-auto mb-10 hidden lg:flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Articles</h1>
                {isAuthenticated && (
                    <ButtonLink href="/articles/new" variant="primary" label="+ Créer un article" />
                )}
            </div>
            <div className="max-w-6xl mx-auto grid gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {articles.map((article) => {
                    const isAuthor = currentUserId === article.authorId;
                    const isAdmin = currentUserRole === "ADMIN";
                    const canManage = isAuthor || isAdmin;
                    return (
                        <Link
                            key={article.id}
                            href={`/articles/${article.id}`}
                            className="w-[90%] sm:w-[85%] md:w-full"
                        >
                            <ArticleCard
                                article={article}
                                canManage={canManage}
                                onEdit={onEditArticle}
                                onDelete={onDeleteArticle}
                            />
                        </Link>
                    );
                })}
            </div>
            {/* Pagination */}
            <div className="max-w-6xl mx-auto flex flex-row flex-wrap items-center justify-center mt-12 w-full">
                {/* Bloc desktop */}
                <div className="hidden sm:flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow border border-gray-200 dark:border-slate-700 px-3 sm:px-12 py-3 sm:py-4 mx-auto min-w-[220px] sm:min-w-[480px] max-w-full mt-16">
                    {/* Total articles */}
                    <span className="text-gray-500 text-sm sm:text-base whitespace-nowrap hidden sm:inline">
                        {total} articles au total
                    </span>
                    {/* Pagination */}
                    <button
                        className="p-2 sm:p-3 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white font-semibold disabled:opacity-50 flex items-center justify-center shadow-sm transition-colors duration-150 hover:bg-blue-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base sm:text-lg"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        aria-label="Page précédente"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                    {/* Pagination pages : visible uniquement sur sm+ */}
                    <div className="hidden sm:flex flex-row items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                className={`px-4 py-2 rounded-full font-semibold text-base mx-0.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent ${p === page ? "bg-blue-500 text-white shadow" : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-slate-600"}`}
                                onClick={() => onPageChange(p)}
                                disabled={p === page}
                                aria-label={`Page ${p}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        className="p-2 sm:p-3 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white font-semibold disabled:opacity-50 flex items-center justify-center shadow-sm transition-colors duration-150 hover:bg-blue-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base sm:text-lg"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        aria-label="Page suivante"
                    >
                        <FaChevronRight size={20} />
                    </button>
                    {/* Sélecteur taille page */}
                    <select
                        className="ml-2 sm:ml-3 px-0 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm sm:text-base w-12 sm:w-16 text-center appearance-none"
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="ml-1 sm:ml-2 text-gray-500 dark:text-gray-500 text-sm sm:text-base hidden sm:inline">
                        Articles par page
                    </span>
                </div>
            </div>
            {/* Bloc mobile, sous la pagination principale */}
            <div className="block sm:hidden w-full mt-16">
                <div className="bg-white/80 dark:bg-slate-800/80 border rounded-xl shadow px-4 py-4 mx-auto max-w-xs flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <button
                            className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white font-semibold disabled:opacity-50 flex items-center justify-center shadow-sm transition-colors duration-150 hover:bg-blue-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            aria-label="Page précédente"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <span className="text-gray-700 dark:text-white font-bold text-lg select-none">
                            Page {page} / {totalPages}
                        </span>
                        <button
                            className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white font-semibold disabled:opacity-50 flex items-center justify-center shadow-sm transition-colors duration-150 hover:bg-blue-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            aria-label="Page suivante"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center">
                            <select
                                className="px-2 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm w-20 text-center appearance-none"
                                value={limit}
                                onChange={(e) => onLimitChange(Number(e.target.value))}
                            >
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            {/* Texte retiré sur mobile */}
                        </div>
                        <span className="block text-gray-500 text-sm text-center mt-1">
                            {total} articles au total
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}