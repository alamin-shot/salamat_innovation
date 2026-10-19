import { Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TelesalesNoteCell({
    rowId,
    note,
    manager,
}: {
    rowId: string;
    note: string;
    manager: any;
}) {
    if (!note || note === "-") {
        return <span className="text-sm text-brand-subtext">-</span>;
    }

    const isOpen = manager.activeNoteRowId === rowId;

    return (
        <div className="relative inline-block">
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => manager.toggleNotePopover(rowId)}
                className="rounded-full bg-emerald-50/80 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                title="View Note"
            >
                <Eye className="h-3.5 w-3.5" />
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={manager.closeNotePopover} />
                    <div className="absolute right-0 top-full mt-2 w-72 z-20 rounded-xl border border-gray-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95">
                        <h4 className="text-xs font-bold text-gray-800 mb-2">Note</h4>
                        <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3 text-xs text-gray-700 leading-relaxed">
                            {note}
                        </div>
                        <div className="flex justify-end mt-3">
                            <Button
                                type="button"
                                variant="success"
                                size="sm"
                                onClick={manager.closeNotePopover}
                                className="h-7 px-3.5 text-xs"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}