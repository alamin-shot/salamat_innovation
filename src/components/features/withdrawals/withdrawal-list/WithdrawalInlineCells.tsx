import { Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WithdrawalManagerType } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalManager";

export function WithdrawalInlineNoteCell({ rowId, note, manager }: { rowId: string; note: string; manager: WithdrawalManagerType }) {
    if (!note || note === "-") return <span className="text-sm text-brand-subtext">-</span>;

    const isOpen = manager.activeNoteRowId === rowId;

    return (
        <div className="relative inline-block">
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.toggleNotePopover(rowId)} className="rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700">
                <Eye className="h-3.5 w-3.5" />
            </Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={manager.closeNotePopover} />
                    <div className="absolute right-0 top-full mt-1.5 z-20 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95">
                        <h4 className="text-[11px] font-bold text-gray-700 mb-1">Note</h4>
                        <p className="text-xs text-gray-600">{note}</p>
                        <div className="flex justify-end mt-2">
                            <Button type="button" variant="success" size="sm" onClick={manager.closeNotePopover} className="h-6 px-2.5 text-[11px]">Close</Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}