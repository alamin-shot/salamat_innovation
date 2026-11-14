import { HubSpokeDefinition, HubSpokeGroup } from "@/types/hub";

/** The card definition of one spoke (label, description, icon, tone) for its full-page header. */
export function findSpoke<SpokeKey extends string>(groups: HubSpokeGroup<SpokeKey>[], id: SpokeKey): HubSpokeDefinition<SpokeKey> {
    const spoke = groups.flatMap((group) => group.spokes).find((candidate) => candidate.id === id);
    if (!spoke) throw new Error(`Unknown hub spoke: ${id}`);
    return spoke;
}
