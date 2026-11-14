// LAYER 1: Our Team (storefront "Our Team" section). Future NestJS resource: /api/team-members.

export type TeamMemberStatus = "Active" | "Inactive";

export interface TeamMember {
    id: string;
    name: string;
    designation: string;
    /** Role bio / summary shown on the team view. */
    description: string;
    /** Profile picture (scaled data URL until media storage exists). */
    photoUrl?: string;
    status: TeamMemberStatus;
    /** ISO-8601 */
    createdAt: string;
}

export type TeamMemberInput = Pick<TeamMember, "name" | "designation" | "description" | "photoUrl" | "status">;

export type TeamMemberError = "name_required" | "designation_required";

export type TeamMemberSaveResult = { ok: true; member: TeamMember } | { ok: false; error: TeamMemberError };

export interface OurTeamState {
    members: TeamMember[];
    /** True once members saved by the old generic page were copied in. */
    legacyImported: boolean;
    addMember: (input: TeamMemberInput) => TeamMemberSaveResult;
    updateMember: (id: string, input: TeamMemberInput) => TeamMemberSaveResult;
    deleteMembers: (ids: string[]) => void;
    importLegacy: (members: TeamMember[]) => void;
}
