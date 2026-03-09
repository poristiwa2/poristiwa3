'use client';

import { useEffect, useState } from 'react';

interface Article {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  source: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/pool');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-stone-900">poristiwa.my.id</h1>
        <p className="text-stone-600">The ultimate news aggregator.</p>
      </header>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
        </div>
      ) : articles.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-stone-600">
                  {article.title}
                </a>
              </h2>
              <p className="text-stone-500 text-sm mb-4">{article.source} • {new Date(article.pubDate).toLocaleDateString()}</p>
              <div className="text-stone-700 line-clamp-4 mb-4">{article.content}</div>
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-stone-900 font-medium hover:underline">
                Read more &rarr;
              </a>
            </article>
          ))}
        </section>
      ) : (
        <div className="text-center p-12 text-stone-500">
          <p>No news articles available yet. The scraper will run shortly.</p>
        </div>
      )}
    </main>
  );
}
