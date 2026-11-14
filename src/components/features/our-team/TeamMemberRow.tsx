import * as React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TeamMember } from "@/types/ourTeam";
import { TeamMemberAvatar } from "./TeamMemberAvatar";

interface TeamMemberRowProps {
    member: TeamMember;
    isSelected: boolean;
    onToggle: (id: string, checked: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

/** Same look as the old generic table row, plus a short description and a View action. */
export const TeamMemberRow = React.memo(function TeamMemberRow({ member, isSelected, onToggle, onView, onEdit, onDelete }: TeamMemberRowProps) {
    return (
        <tr className="group transition-colors hover:bg-gray-50">
            <td className="p-4">
                <input type="checkbox" checked={isSelected} onChange={(e) => onToggle(member.id, e.target.checked)} className="cursor-pointer rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            </td>
            <td className="p-4 font-medium text-gray-900">{member.name}</td>
            <td className="p-4">{member.designation}</td>
            <td className="max-w-xs p-4">
                <p className="line-clamp-2 text-gray-600" title={member.description || undefined}>{member.description || "-"}</p>
            </td>
            <td className="p-4"><TeamMemberAvatar name={member.name} photoUrl={member.photoUrl} size="sm" /></td>
            <td className="p-4">
                <span className={`text-xs font-bold ${member.status === "Active" ? "text-green-600" : "text-red-500"}`}>{member.status}</span>
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => onView(member.id)} title="View"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(member.id)} title="Edit"><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(member.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </td>
        </tr>
    );
});
TeamMemberRow.displayName = "TeamMemberRow";
