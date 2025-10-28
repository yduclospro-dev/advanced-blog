/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import { Article } from "@/types/Article";
import { ButtonLink, Card } from "@/components/ui";
import ArticleCard from "@/components/ArticleCard";

interface HomePresenterProps {
  currentUser: { username: string } | null;
  isAuthenticated: boolean;
  featuredArticles: Article[];
}

export default function HomePresenter({
  currentUser,
  isAuthenticated,
  featuredArticles,
}: HomePresenterProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden transition-colors">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-sky-400/20 dark:from-sky-400/30 to-blue-600/20 dark:to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-400/15 dark:from-purple-400/20 to-pink-600/15 dark:to-pink-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-teal-400/20 dark:from-teal-400/25 to-green-500/20 dark:to-green-500/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-sky-500/10 backdrop-blur-sm border border-sky-500/20 rounded-full">
              {isAuthenticated && currentUser ? (
                <span className="text-sky-600 dark:text-sky-400 text-sm font-medium">
                  👋 Bienvenue {currentUser.username}
                </span>
              ) : (
                <span className="text-sky-600 dark:text-sky-400 text-sm font-medium">
                  ✨ Plateforme de blogging nouvelle génération
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Découvrez des histoires <br />
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent">qui vous inspirent</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Rejoignez notre communauté de passionnés et partagez vos idées avec le monde entier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink 
                href="/articles" 
                variant="primary"
                size="lg"
                label="Explorer les articles"
              />
              {!isAuthenticated && (
                <ButtonLink 
                  href="/registration" 
                  variant="secondary"
                  size="lg"
                  label="Commencer gratuitement"
                />
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Articles en vedette</h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">Découvrez les derniers articles de notre communauté</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => {
              return (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <ArticleCard article={article} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Pourquoi choisir BlogHub ?</h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">Tous les outils dont vous avez besoin pour réussir</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="feature" padding="lg">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30 dark:shadow-sky-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Écrire librement</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Un éditeur simple et puissant pour donner vie à vos idées en quelques clics
              </p>
            </Card>

            <Card variant="feature" padding="lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Communauté active</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Échangez avec des milliers de lecteurs et écrivains passionnés
              </p>
            </Card>

            <Card variant="feature" padding="lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 dark:shadow-green-500/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Statistiques détaillées</h3>
              <p className="text-gray-600 dark:text-slate-300">
                Suivez la performance de vos articles et comprenez votre audience
              </p>
            </Card>
          </div>
        </section>

        {!isAuthenticated && (
          <section className="relative py-20">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/15 dark:from-sky-500/20 to-blue-600/15 dark:to-blue-600/20 backdrop-blur-3xl"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Prêt à partager vos histoires ?
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">
                Rejoignez des milliers d'écrivains et commencez votre aventure dès aujourd'hui
              </p>
              <ButtonLink 
                href="/registration" 
                variant="primary"
                size="lg"
                className="shadow-2xl shadow-sky-500/30 dark:shadow-sky-500/50"
                label="Créer mon compte gratuitement"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
