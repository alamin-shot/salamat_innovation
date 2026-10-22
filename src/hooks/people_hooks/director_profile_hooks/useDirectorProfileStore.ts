import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DirectorProfile {
    id: string;
    fullName: string;
    title: string;
    email: string;
    phone: string;
    password: string;
    avatar: string | null;
}

interface DirectorProfileState {
    profiles: DirectorProfile[];
    addProfile: (profile: Omit<DirectorProfile, "id">) => void;
    updateProfile: (id: string, updated: Partial<DirectorProfile>) => void;
    deleteProfile: (id: string) => void;
}

export const useDirectorProfileStore = create<DirectorProfileState>()(
    persist(
        (set) => ({
            profiles: [
                { id: "2", fullName: "Atick Hasan Sajib", title: "Managing Director", email: "atickhasansajib@gmail.com", phone: "01897715221", password: "password123", avatar: "AH" },
                { id: "1", fullName: "Mohammadun Nabi", title: "Chairman", email: "nabi@gmail.com", phone: "01711000000", password: "password123", avatar: "MN" },
            ],
            addProfile: (newProfile) =>
                set((state) => ({
                    profiles: [{ ...newProfile, id: crypto.randomUUID() }, ...state.profiles],
                })),
            updateProfile: (id, updated) =>
                set((state) => ({
                    profiles: state.profiles.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteProfile: (id) =>
                set((state) => ({
                    profiles: state.profiles.filter((item) => item.id !== id),
                })),
        }),
        { name: "tekzo_director_profile_store" }
    )
);