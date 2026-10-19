import { FileText, Paperclip, Upload, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

// 1. Inline Note Popover Cell (Driven by manager state)
export function InlineNoteCell({
    rowId,
    note,
    manager,
}: {
    rowId: string;
    note: string;
    manager: any;
}) {
    const isOpen = manager.activeNoteRowId === rowId;

    return (
        <div className="relative inline-block">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => manager.openNotePopover(rowId, note)}
                className={`h-7 gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${note
                    ? "border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100/80 max-w-[140px]"
                    : "border-dashed border-gray-300 bg-gray-50/50 text-gray-500 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
            >
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate">{note || "Set Note"}</span>
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={manager.closeNotePopover} />
                    <div className="absolute right-0 top-full mt-1.5 w-64 z-20 rounded-lg border border-gray-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                            Customer / Supplier Note
                        </label>
                        <textarea
                            value={manager.noteDraft}
                            onChange={(e) => manager.setNoteDraft(e.target.value)}
                            rows={3}
                            placeholder="Write a note..."
                            className="w-full rounded border border-gray-200 bg-white p-2 text-[12px] text-gray-700 focus:border-emerald-500 focus:outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={manager.closeNotePopover}
                                className="h-7 px-2.5 text-[11px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="success"
                                size="sm"
                                onClick={() => manager.handleNoteSave(rowId)}
                                className="h-7 px-2.5 text-[11px]"
                            >
                                <Check className="h-3 w-3 mr-1" /> Save
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// 2. Inline Price Document Cell
export function InlinePriceDocCell({
    fileName,
    onUpload,
}: {
    fileName: string;
    onUpload: (name: string) => void;
}) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file.name);
        }
    };

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="file"
                accept=".pdf,.xls,.xlsx,.csv,.png,.jpg"
                onChange={handleFileChange}
                className="hidden"
            />
            {fileName ? (
                <span
                    title="Click to replace Price Document (Max 100MB)"
                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100/80 max-w-[140px] transition-colors"
                >
                    <Paperclip className="h-3 w-3 shrink-0" />
                    <span className="truncate">{fileName}</span>
                </span>
            ) : (
                <span
                    title="Upload Price Document (.pdf, .xls, .xlsx, .csv, .png, .jpg)"
                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-dashed border-gray-300 bg-gray-50/50 px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                    <Upload className="h-3 w-3 shrink-0" />
                    <span>Upload</span>
                </span>
            )}
        </label>
    );
}

// 3. Inline Address Eye Popover (Driven by manager state)
export function InlineAddressCell({
    rowId,
    address,
    manager,
}: {
    rowId: string;
    address: string;
    manager: any;
}) {
    if (!address || address === "-") {
        return <span className="text-sm text-brand-subtext">-</span>;
    }

    const isOpen = manager.activeAddressRowId === rowId;

    return (
        <div className="relative inline-block">
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => manager.toggleAddressPopover(rowId)}
                className="rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                title={address}
            >
                <Eye className="h-3.5 w-3.5" />
            </Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={manager.closeAddressPopover} />
                    <div className="absolute left-0 top-full mt-1 z-20 w-52 rounded-lg border border-gray-200 bg-white p-2.5 text-[12px] text-gray-700 shadow-lg">
                        {address}
                    </div>
                </>
            )}
        </div>
    );
}