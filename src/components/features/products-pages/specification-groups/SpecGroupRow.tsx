"use client";
import * as React from "react";
import { Edit, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { SpecGroup } from "@/types/products";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { AuditCells } from "../shared/AuditCells";
import { ChipListCell } from "../shared/ChipListCell";

interface SpecGroupRowProps {
    group: SpecGroup;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateSubGroups: (id: string, subGroups: string[]) => void;
}

export const SpecGroupRow = React.memo(function SpecGroupRow({
    group, isSelected, onToggleSelect, onEdit, onDelete, onUpdateSubGroups
}: SpecGroupRowProps) {
    const chipItems = React.useMemo(
        () => group.subGroups.map((sub, idx) => ({ key: `${idx}-${sub}`, label: sub })),
        [group.subGroups],
    );

    const handleAddSubGroup = React.useCallback(
        (label: string) => onUpdateSubGroups(group.id, [...group.subGroups, label]),
        [group.id, group.subGroups, onUpdateSubGroups],
    );

    return (
        <TableRow className={isSelected ? "bg-emerald-50/30" : ""}>
            <TableCell className="w-[48px] px-4 align-top pt-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(group.id)}
                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
            </TableCell>

            <TableCell className="align-top pt-3">
                <NameWithThumbnail name={group.name} image={null} />
            </TableCell>

            <TableCell className="py-3">
                <ChipListCell
                    items={chipItems}
                    chipClassName="inline-flex items-center rounded-md bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                    onAdd={handleAddSubGroup}
                    addTitle="Add Sub Specification Value"
                    placeholder="Enter Sub Specification Value"
                />
            </TableCell>

            <AuditCells createdBy={group.createdBy} createdAt={group.createdAt} className="align-top pt-4" />

            <TableCell className="text-right align-top pt-3">
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(group.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit Specification Group"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(group.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Specification Group"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

SpecGroupRow.displayName = "SpecGroupRow";
