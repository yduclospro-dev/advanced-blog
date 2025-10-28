import Link from "next/link";
import { Article } from "@/types/Article";
import ArticleCard from "@/components/ArticleCard";
import { ButtonLink } from "@/components/ui";

interface ArticlesListPresenterProps {
    articles: Article[];
    isAuthenticated: boolean;
}

export default function ArticlesListPresenter({ 
    articles, 
    isAuthenticated 
}: ArticlesListPresenterProps) {
    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-16 px-10 md:px-20 lg:px-32 transition-colors">
            
            <div className="max-w-6xl mx-auto mb-10 lg:hidden">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Articles
                </h1>
                {isAuthenticated && (
                    <ButtonLink
                        href="/articles/new"
                        variant="primary"
                        label="+ Créer un article"
                    />
                )}
            </div>

            
            <div className="max-w-6xl mx-auto mb-10 hidden lg:flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    Articles
                </h1>
                {isAuthenticated && (
                    <ButtonLink
                        href="/articles/new"
                        variant="primary"
                        label="+ Créer un article"
                    />
                )}
            </div>

            <div className="max-w-6xl mx-auto grid gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {articles.map((article) => (
                    <Link 
                        key={article.id}
                        href={`/articles/${article.id}`}
                        className="w-[90%] sm:w-[85%] md:w-[100%]"
                    >
                        <ArticleCard article={article} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
