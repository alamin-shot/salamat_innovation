import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vlog, VlogInput, VlogState } from "@/types/vlogs";
import { INITIAL_VLOGS } from "@/mocks/vlogs.mock";
import { vlogInputError } from "@/utils/vlogRules";

// LAYER 2: Vlog optimistic cache (future /api/vlogs). Separate from News and Reels.

const VLOG_AUDIT_ACTOR = "Admin";

/** Trims the text fields before saving. */
const clean = (input: VlogInput): VlogInput => ({
    ...input,
    title: input.title.trim(),
    videoUrl: input.videoUrl.trim(),
    description: input.description.trim(),
});

export const useVlogStore = create<VlogState>()(
    persist(
        (set, get) => ({
            vlogs: INITIAL_VLOGS as Vlog[],

            addVlog: (input) => {
                const error = vlogInputError(input);
                if (error) return { ok: false, error };
                const vlog: Vlog = {
                    ...clean(input),
                    id: `vlog-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    createdBy: VLOG_AUDIT_ACTOR,
                };
                set((state) => ({ vlogs: [vlog, ...state.vlogs] }));
                return { ok: true, id: vlog.id };
            },

            updateVlog: (id, input) => {
                const error = vlogInputError(input);
                if (error) return { ok: false, error };
                if (!get().vlogs.some((vlog) => vlog.id === id)) return { ok: false, error: "not_found" };
                set((state) => ({
                    vlogs: state.vlogs.map((vlog) => (vlog.id === id ? { ...vlog, ...clean(input) } : vlog)),
                }));
                return { ok: true, id };
            },

            deleteVlogs: (ids) => set((state) => ({
                vlogs: state.vlogs.filter((vlog) => !ids.includes(vlog.id)),
            })),
        }),
        { name: "erp-vlogs-storage-v1" }
    )
);
