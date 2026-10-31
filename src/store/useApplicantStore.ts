import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApplicantStatus = "Pending" | "Shortlisted" | "Rejected";

export interface Applicant {
    id: string;
    jobId: string; // Relational link to Career
    jobTitle: string; // Denormalized for easy table rendering
    name: string;
    email: string;
    phone: string;
    gender: "Male" | "Female" | "Other";
    age: number;
    skills: string; // Comma separated string from user input
    reasonToJoin: string;
    cvUrl: string | null;
    status: ApplicantStatus;
    appliedOn: string;
}

interface ApplicantStore {
    applicants: Applicant[];
    updateStatus: (id: string, status: ApplicantStatus) => void;
    deleteApplicant: (id: string) => void;
    bulkDeleteApplicants: (ids: string[]) => void;
}

export const useApplicantStore = create<ApplicantStore>()(
    persist(
        (set) => ({
            applicants: [
                {
                    id: "1",
                    jobId: "1", // Links to Next.js Developer
                    jobTitle: "Next.js Developer",
                    name: "Monoj kumar",
                    email: "monoj93roy@gmail.com",
                    phone: "01757859893",
                    gender: "Male",
                    age: 25,
                    skills: "Next.js, React.js, JavaScript (ES6+), TypeScript, Tailwind CSS",
                    reasonToJoin: "I want to join Salamat Innovation because I am eager to contribute my Next.js and React.js expertise to building innovative, scalable web applications...",
                    cvUrl: "#",
                    status: "Pending",
                    appliedOn: "2026-10-29T10:00:00.000Z"
                },
                {
                    id: "2",
                    jobId: "1",
                    jobTitle: "Next.js Developer",
                    name: "Fahim Sarker",
                    email: "sarkerfahim599@gmail.com",
                    phone: "01647389997",
                    gender: "Male",
                    age: 24,
                    skills: "React, Node.js, Express",
                    reasonToJoin: "Looking for a challenging role to grow my skills.",
                    cvUrl: "#",
                    status: "Shortlisted",
                    appliedOn: "2026-10-26T14:30:00.000Z"
                }
            ],
            updateStatus: (id, status) => set((state) => ({
                applicants: state.applicants.map(a => a.id === id ? { ...a, status } : a)
            })),
            deleteApplicant: (id) => set((state) => ({
                applicants: state.applicants.filter(a => a.id !== id)
            })),
            bulkDeleteApplicants: (ids) => set((state) => ({
                applicants: state.applicants.filter(a => !ids.includes(a.id))
            }))
        }),
        { name: "erp-applicant-storage-v2" }
    )
);