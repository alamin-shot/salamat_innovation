import { Drawer } from "@/components/ui/Drawer";
import { TeamMember } from "@/types/ourTeam";
import { formatDay } from "@/utils/dateDisplay";
import { TeamMemberAvatar } from "./TeamMemberAvatar";

/** Read-only team member card, including the description. */
export function TeamMemberViewDrawer({ member, isOpen, onClose }: { member: TeamMember | null; isOpen: boolean; onClose: () => void }) {
    return (
        <Drawer title="Team Member" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {member && (
                <div className="min-h-full bg-gray-50/50 p-4 pb-32">
                    <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row">
                        <TeamMemberAvatar name={member.name} photoUrl={member.photoUrl} size="lg" />
                        <div className="flex flex-1 flex-col gap-3">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
                                <p className="text-sm font-medium text-emerald-700">{member.designation}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className={`rounded-full px-2.5 py-0.5 font-bold ${member.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>{member.status}</span>
                                <span className="text-gray-500">Added {formatDay(member.createdAt)}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3">
                                <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Description</h3>
                                {member.description ? (
                                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{member.description}</p>
                                ) : (
                                    <p className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">No description yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
