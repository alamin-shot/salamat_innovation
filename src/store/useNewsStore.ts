import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SeoBlock {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
}

export interface NewsArticle {
    id: string;
    name: string;
    heading: string;
    slug: string;
    description: string; // Rich Text HTML
    image: string | null;
    seo: SeoBlock | null;
}

interface NewsStore {
    articles: NewsArticle[];
    addArticle: (article: Omit<NewsArticle, "id">) => void;
    updateArticle: (id: string, updatedData: Partial<NewsArticle>) => void;
    deleteArticle: (id: string) => void;
    bulkDeleteArticles: (ids: string[]) => void;
}

export const useNewsStore = create<NewsStore>()(
    persist(
        (set) => ({
            articles: [
                {
                    id: "1",
                    name: "TEKZO Grand Opening Today",
                    heading: "TEKZO Grand Opening Today",
                    slug: "tekzo-grand-opening-today",
                    description: "<p>The wait is over — it's finally happening! Experience the most exciting launch of the season...</p>",
                    image: null,
                    seo: null
                },
                {
                    id: "2",
                    name: "VOLTME Celebrating 3 Years",
                    heading: "Celebrating 3 Years of Togetherness with Voltme Innovations!",
                    slug: "voltme-celebrating-3-years",
                    description: "<p>Join us as we celebrate a major milestone.</p>",
                    image: null,
                    seo: null
                }
            ],
            addArticle: (articleData) => set((state) => ({
                articles: [...state.articles, { ...articleData, id: Date.now().toString() }]
            })),
            updateArticle: (id, updatedData) => set((state) => ({
                articles: state.articles.map(article => article.id === id ? { ...article, ...updatedData } : article)
            })),
            deleteArticle: (id) => set((state) => ({
                articles: state.articles.filter(article => article.id !== id)
            })),
            bulkDeleteArticles: (ids) => set((state) => ({
                articles: state.articles.filter(article => !ids.includes(article.id))
            }))
        }),
        { name: "erp-news-storage-v1" }
    )
);