import * as React from "react";
import { Edit, Eye, PlayCircle, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Vlog } from "@/types/vlogs";

interface VlogRowProps {
    vlog: Vlog;
    onPreview: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const VlogRow = React.memo(function VlogRow({ vlog, onPreview, onEdit, onDelete }: VlogRowProps) {
    return (
        <TableRow className="group">
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                        {vlog.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element -- admin-entered external URL
                            <img src={vlog.thumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <PlayCircle className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-800">{vlog.title}</p>
                        <p className="max-w-md truncate text-xs text-gray-500">{vlog.description || "—"}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-[13px] text-gray-600">{vlog.publishDate}</TableCell>
            <TableCell><Badge variant={vlog.status === "Active" ? "success" : "destructive"}>{vlog.status}</Badge></TableCell>
            <TableCell className="text-[13px] text-gray-600">{vlog.createdBy}</TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon-sm" onClick={() => onPreview(vlog.id)} title="Preview vlog"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(vlog.id)} title="Edit vlog"><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(vlog.id)} title="Delete vlog"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </TableCell>
        </TableRow>
    );
});

VlogRow.displayName = "VlogRow";
