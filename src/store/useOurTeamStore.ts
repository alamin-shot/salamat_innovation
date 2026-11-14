import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OurTeamState, TeamMember, TeamMemberError, TeamMemberInput } from "@/types/ourTeam";
import { INITIAL_TEAM } from "@/mocks/ourTeam.mock";
import { useGenericEntityStore } from "@/store/useGenericEntityStore";

// LAYER 2: Our Team cache (future /api/team-members). Replaces the generic CRUD factory store for this page.

const LEGACY_KEY = "our-team";

function validate(input: TeamMemberInput): TeamMemberError | null {
    if (!input.name.trim()) return "name_required";
    if (!input.designation.trim()) return "designation_required";
    return null;
}

const clean = (input: TeamMemberInput): TeamMemberInput => ({
    name: input.name.trim(),
    designation: input.designation.trim(),
    description: input.description.trim(),
    photoUrl: input.photoUrl || undefined,
    status: input.status,
});

/** Members added on the old generic page, mapped onto the typed shape. */
function legacyMembers(): TeamMember[] {
    const records = useGenericEntityStore.getState().entities[LEGACY_KEY] ?? [];
    return records.map((record): TeamMember => ({
        id: `team-legacy-${record.id}`,
        name: typeof record.name === "string" ? record.name : "",
        designation: typeof record.designation === "string" ? record.designation : "",
        description: typeof record.description === "string" ? record.description : typeof record.about === "string" ? record.about : "",
        photoUrl: typeof record.image === "string" && record.image.startsWith("data:") ? record.image : undefined,
        status: record.status === "Inactive" ? "Inactive" : "Active",
        createdAt: new Date().toISOString(),
    })).filter((member) => member.name);
}

export const useOurTeamStore = create<OurTeamState>()(
    persist(
        (set, get) => ({
            members: INITIAL_TEAM,
            legacyImported: false,

            addMember: (input) => {
                const error = validate(input);
                if (error) return { ok: false, error };
                const member: TeamMember = { ...clean(input), id: `team-${Date.now()}`, createdAt: new Date().toISOString() };
                set((state) => ({ members: [...state.members, member] }));
                return { ok: true, member };
            },

            updateMember: (id, input) => {
                const target = get().members.find((member) => member.id === id);
                if (!target) return { ok: false, error: "name_required" };
                const error = validate(input);
                if (error) return { ok: false, error };
                const member: TeamMember = { ...target, ...clean(input) };
                set((state) => ({ members: state.members.map((record) => (record.id === id ? member : record)) }));
                return { ok: true, member };
            },

            deleteMembers: (ids) => set((state) => ({ members: state.members.filter((member) => !ids.includes(member.id)) })),

            importLegacy: (members) => set((state) => ({
                members: [...state.members, ...members.filter((member) => !state.members.some((existing) => existing.id === member.id))],
                legacyImported: true,
            })),
        }),
        {
            name: "erp-our-team-storage-v1",
            // One time: bring over anyone saved by the old generic Our Team page.
            onRehydrateStorage: () => (state) => {
                if (state && !state.legacyImported) state.importLegacy(legacyMembers());
            },
        }
    )
);
