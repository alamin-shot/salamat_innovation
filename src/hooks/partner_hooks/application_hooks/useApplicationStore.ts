import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Application {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
}

interface ApplicationState {
    applications: Application[];
    addApplication: (application: Omit<Application, "id">) => void;
    updateApplication: (id: string, updated: Partial<Application>) => void;
    deleteApplication: (id: string) => void;
    bulkDeleteApplications: (ids: string[]) => void;
    updateStatus: (id: string, status: string) => void;
}

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            applications: [
                { id: "1", name: "Mosarraf Hossain", phone: "01911280666", email: "tezaratxyz@gmail.com", address: "-", status: "Pending" },
                { id: "2", name: "Arfat", phone: "01840308004", email: "bc.arfat@gmail.com", address: "-", status: "Approved" },
                { id: "3", name: "MD ATIK HASAN", phone: "01601313238", email: "info@dreamify.com.bd", address: "-", status: "Pending" },
                { id: "4", name: "Md: Mostakin", phone: "01706252076", email: "mostakinrahman06@gmail.com", address: "-", status: "Rejected" },
                { id: "5", name: "shahibul sadik musa", phone: "01755808489", email: "cellxpress009@gmail.com", address: "-", status: "Pending" },
            ],
            addApplication: (newApplication) =>
                set((state) => ({
                    applications: [{ ...newApplication, id: crypto.randomUUID() }, ...state.applications],
                })),
            updateApplication: (id, updated) =>
                set((state) => ({
                    applications: state.applications.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteApplication: (id) =>
                set((state) => ({
                    applications: state.applications.filter((item) => item.id !== id),
                })),
            bulkDeleteApplications: (ids) =>
                set((state) => ({
                    applications: state.applications.filter((item) => !ids.includes(item.id)),
                })),
            updateStatus: (id, status) =>
                set((state) => ({
                    applications: state.applications.map((item) => item.id === id ? { ...item, status } : item),
                })),
        }),
        { name: "tekzo_application_store" }
    )
);