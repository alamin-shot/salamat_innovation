import * as React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";

interface BarcodeRowActionsProps {
    id: string;
    onView: (id: string) => void;
    /** Omitted on the read-only History page. */
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const BASE = "p-1.5 text-brand-subtext rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand-subtext";

/** View / Edit / Delete buttons, same styling the barcode tables used. Locked actions are disabled. */
export const BarcodeRowActions = React.memo(function BarcodeRowActions({
    id, onView, onEdit, onDelete, canEdit = false, canDelete = false,
}: BarcodeRowActionsProps) {
    return (
        <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => onView(id)} className={`${BASE} hover:text-emerald-600 hover:bg-emerald-50`} title="View details">
                <Eye className="h-4 w-4" />
            </button>
            {onEdit && (
                <button
                    type="button"
                    onClick={() => onEdit(id)}
                    disabled={!canEdit}
                    className={`${BASE} hover:text-blue-600 hover:bg-blue-50`}
                    title={canEdit ? "Edit barcode" : "Sold barcodes are locked"}
                >
                    <Edit className="h-4 w-4" />
                </button>
            )}
            {onDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(id)}
                    disabled={!canDelete}
                    className={`${BASE} hover:text-red-600 hover:bg-red-50`}
                    title={canDelete ? "Delete barcode" : "Only barcodes that are not received yet can be deleted"}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
});

BarcodeRowActions.displayName = "BarcodeRowActions";
