import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DirectorError, DirectorProfile, DirectorsState, DirectorUpdateInput } from "@/types/directors";
import { INITIAL_DIRECTORS } from "@/mocks/directors.mock";
import { normalizeBdPhone } from "@/utils/phoneRules";

// LAYER 2: Directors cache (future /api/directors). Replaces the two old lists (Directors module
// profiles and the Withdrawals "Director" list); ids "1" / "2" are the ones Deposits and Withdrawals use.

function validate(input: DirectorUpdateInput, isNew: boolean): DirectorError | null {
    if (!input.fullName.trim()) return "name_required";
    if (!input.title.trim()) return "title_required";
    if (!input.email.trim()) return "email_required";
    if (!normalizeBdPhone(input.phone)) return "phone_invalid";
    if (isNew && !input.password?.trim()) return "password_required";
    return null;
}

export const useGlobalDirectorsStore = create<DirectorsState>()(
    persist(
        (set, get) => ({
            directors: INITIAL_DIRECTORS,

            addDirector: (input) => {
                const error = validate(input, true);
                if (error) return { ok: false, error };
                const director: DirectorProfile = {
                    id: `dir-${Date.now()}`,
                    fullName: input.fullName.trim(),
                    title: input.title.trim(),
                    email: input.email.trim(),
                    phone: normalizeBdPhone(input.phone) ?? input.phone.trim(),
                    password: input.password,
                    avatarUrl: input.avatarUrl,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({ directors: [director, ...state.directors] }));
                return { ok: true, director };
            },

            updateDirector: (id, input) => {
                const target = get().directors.find((director) => director.id === id);
                if (!target) return { ok: false, error: "name_required" };
                const error = validate(input, false);
                if (error) return { ok: false, error };
                const director: DirectorProfile = {
                    ...target,
                    fullName: input.fullName.trim(),
                    title: input.title.trim(),
                    email: input.email.trim(),
                    phone: normalizeBdPhone(input.phone) ?? input.phone.trim(),
                    // An empty password field keeps the current one.
                    password: input.password?.trim() ? input.password : target.password,
                    avatarUrl: input.avatarUrl,
                };
                set((state) => ({ directors: state.directors.map((record) => (record.id === id ? director : record)) }));
                return { ok: true, director };
            },

            deleteDirector: (id) => set((state) => ({ directors: state.directors.filter((director) => director.id !== id) })),
        }),
        { name: "erp-directors-storage-v1" }
    )
);
