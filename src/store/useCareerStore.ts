import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JobType = "Full Time" | "Part Time" | "Contract" | "Internship";
export type CareerStatus = "Active" | "Inactive";

export interface Career {
    id: string;
    heading: string;
    image: string | null;
    vacancies: number;
    type: JobType;
    salary: string;
    deadline: string;
    description: string;
    qualification: string;
    benefits: string;
    keywords: string;
    status: CareerStatus;
    createdAt: string;
}

interface CareerStore {
    careers: Career[];
    addCareer: (career: Omit<Career, "id" | "createdAt">) => void;
    updateCareer: (id: string, updatedData: Partial<Career>) => void;
    deleteCareer: (id: string) => void;
    bulkDeleteCareers: (ids: string[]) => void;
    updateStatus: (id: string, status: CareerStatus) => void;
}

export const useCareerStore = create<CareerStore>()(
    persist(
        (set) => ({
            careers: [
                {
                    id: "1",
                    heading: "Next.js Developer",
                    image: null,
                    vacancies: 5,
                    type: "Full Time",
                    salary: "BDT 25,000 - 30,000",
                    deadline: "2026-10-31T23:59:59.000Z",
                    description: "<p>We are looking for an experienced Next.js Developer...</p>",
                    qualification: "<ul><li>5 years of work experience</li><li>Proficiency with React</li></ul>",
                    benefits: "<ul><li>Competitive Salary</li><li>Paid Time Off</li></ul>",
                    keywords: "next.js developer job circular, TypeScript, front-end",
                    status: "Active",
                    createdAt: "2026-10-01T10:00:00.000Z"
                },
                {
                    id: "2",
                    heading: "Key Account Manager",
                    image: null,
                    vacancies: 3,
                    type: "Full Time",
                    salary: "BDT 15,000 - 25,000",
                    deadline: "2026-09-30T23:59:59.000Z",
                    description: "<p>Looking for a dedicated account manager...</p>",
                    qualification: "<p>BBA/MBA from a reputed university.</p>",
                    benefits: "<p>Standard company benefits apply.</p>",
                    keywords: "account manager, sales, B2B",
                    status: "Active",
                    createdAt: "2026-09-01T10:00:00.000Z"
                }
            ],
            addCareer: (careerData) => set((state) => ({
                careers: [...state.careers, { ...careerData, id: Date.now().toString(), createdAt: new Date().toISOString() }]
            })),
            updateCareer: (id, updatedData) => set((state) => ({
                careers: state.careers.map(c => c.id === id ? { ...c, ...updatedData } : c)
            })),
            deleteCareer: (id) => set((state) => ({
                careers: state.careers.filter(c => c.id !== id)
            })),
            bulkDeleteCareers: (ids) => set((state) => ({
                careers: state.careers.filter(c => !ids.includes(c.id))
            })),
            updateStatus: (id, status) => set((state) => ({
                careers: state.careers.map(c => c.id === id ? { ...c, status } : c)
            }))
        }),
        { name: "erp-career-storage-v1" }
    )
);