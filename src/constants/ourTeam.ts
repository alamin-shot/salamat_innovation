import { TeamMemberError, TeamMemberStatus } from "@/types/ourTeam";

export const TEAM_STATUS_OPTIONS: TeamMemberStatus[] = ["Active", "Inactive"];

export const TEAM_ERRORS: Readonly<Record<TeamMemberError, string>> = {
    name_required: "Name is required.",
    designation_required: "Designation is required.",
};
