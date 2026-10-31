import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FaqStatus = "Active" | "Inactive";

export interface FaqTranslation {
    question: string;
    answer: string;
}

export interface Faq {
    id: string;
    shopName: string;
    order: number;
    views: number;
    status: FaqStatus;
    translations: {
        en: FaqTranslation;
        bn: FaqTranslation;
    };
    createdAt: string;
}

interface FaqStore {
    faqs: Faq[];
    addFaq: (faq: Omit<Faq, "id" | "views" | "createdAt">) => void;
    updateFaq: (id: string, updatedData: Partial<Faq>) => void;
    deleteFaq: (id: string) => void;
    bulkDeleteFaqs: (ids: string[]) => void;
    updateStatus: (id: string, status: FaqStatus) => void;
}

export const useFaqStore = create<FaqStore>()(
    persist(
        (set) => ({
            faqs: [
                {
                    id: "1",
                    shopName: "Global Store",
                    order: 1,
                    views: 1250,
                    status: "Active",
                    translations: {
                        en: {
                            question: "How long does shipping take?",
                            answer: "<p>Standard shipping takes <strong>3-5 business days</strong>.</p>"
                        },
                        bn: {
                            question: "ডেলিভারি হতে কতক্ষণ সময় লাগে?",
                            answer: "<p>সাধারণ ডেলিভারিতে <strong>৩-৫ কর্মদিবস</strong> সময় লাগে।</p>"
                        }
                    },
                    createdAt: "2026-10-25T10:00:00.000Z"
                },
                {
                    id: "2",
                    shopName: "Apple&Series",
                    order: 2,
                    views: 840,
                    status: "Active",
                    translations: {
                        en: {
                            question: "What is your return policy?",
                            answer: "<p>We offer a 7-day free return policy for all sealed products.</p>"
                        },
                        bn: {
                            question: "আপনাদের রিটার্ন পলিসি কি?",
                            answer: "<p>আমরা সমস্ত ইনট্যাক্ট পণ্যের জন্য ৭ দিনের ফ্রি রিটার্ন পলিসি অফার করি।</p>"
                        }
                    },
                    createdAt: "2026-10-26T14:30:00.000Z"
                }
            ],
            addFaq: (faqData) => set((state) => ({
                faqs: [...state.faqs, {
                    ...faqData,
                    id: Date.now().toString(),
                    views: 0,
                    createdAt: new Date().toISOString()
                }]
            })),
            updateFaq: (id, updatedData) => set((state) => ({
                faqs: state.faqs.map(faq => faq.id === id ? { ...faq, ...updatedData } : faq)
            })),
            deleteFaq: (id) => set((state) => ({
                faqs: state.faqs.filter(faq => faq.id !== id)
            })),
            bulkDeleteFaqs: (ids) => set((state) => ({
                faqs: state.faqs.filter(faq => !ids.includes(faq.id))
            })),
            updateStatus: (id, status) => set((state) => ({
                faqs: state.faqs.map(faq => faq.id === id ? { ...faq, status } : faq)
            }))
        }),
        { name: "erp-faq-storage-v1" }
    )
);