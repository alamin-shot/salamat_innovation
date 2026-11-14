import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useTeamMemberForm } from "@/hooks/our_team_hooks/useTeamMemberForm";
import { TeamMember } from "@/types/ourTeam";
import { TEAM_STATUS_OPTIONS } from "@/constants/ourTeam";

function TeamMemberFormBody({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
    const form = useTeamMemberForm(member, onClose);

    return (
        <div className="flex min-h-full flex-col pt-6">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-2 px-4 pb-32">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Name <span className="text-red-500">*</span></label>
                        <input className="erp-input" value={form.name} onChange={(e) => form.setName(e.target.value)} placeholder="Enter Name" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Designation <span className="text-red-500">*</span></label>
                        <input className="erp-input" value={form.designation} onChange={(e) => form.setDesignation(e.target.value)} placeholder="Enter Designation" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Profile Picture</label>
                        <label className="relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:bg-brand-primary/5">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { form.handlePhoto(e.target.files?.[0]); e.target.value = ""; }} />
                            {form.photoUrl ? (
                                <Image src={form.photoUrl} alt="Profile picture" fill unoptimized className="object-contain" />
                            ) : (
                                <>
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500">Click to upload Profile Picture</span>
                                </>
                            )}
                        </label>
                        {form.photoUrl && (
                            <button type="button" onClick={form.clearPhoto} className="inline-flex w-fit items-center gap-1 text-xs font-medium text-rose-600 hover:underline">
                                <X className="h-3 w-3" /> Remove picture
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Status <span className="text-red-500">*</span></label>
                        <CustomSelect value={form.status} onChange={form.setStatus} options={TEAM_STATUS_OPTIONS} placeholder="Select Status" />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="erp-label">Description</label>
                        <textarea className="erp-input h-32 resize-none" value={form.description} onChange={(e) => form.setDescription(e.target.value)} placeholder="Role bio / summary shown on the team page" />
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 mt-auto flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-white px-4 pt-4">
                <Button variant="outline" onClick={onClose} className="h-9 px-6">Cancel</Button>
                <Button variant="success" onClick={form.handleSave} className="h-9 px-8">Save</Button>
            </div>
        </div>
    );
}

export function TeamMemberFormDrawer({ member, isOpen, onClose }: { member: TeamMember | null; isOpen: boolean; onClose: () => void }) {
    return (
        <Drawer title={`${member ? "Update" : "Add"} Our Team`} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {isOpen && <TeamMemberFormBody key={member?.id ?? "new"} member={member} onClose={onClose} />}
        </Drawer>
    );
}
