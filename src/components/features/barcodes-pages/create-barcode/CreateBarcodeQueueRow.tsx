"use client";
import * as React from "react";
import { Keyboard, Trash2, Wand2, X } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { BarcodeSerialMode, BarcodeStagedItem } from "@/types/barcodes";

interface CreateBarcodeQueueRowProps {
    item: BarcodeStagedItem;
    onRemove: (id: string) => void;
    onQuantityChange: (id: string, quantity: number) => void;
    onSkuChange: (id: string, sku: string) => void;
    onMrpChange: (id: string, mrpText: string) => void;
    onSerialModeChange: (id: string, mode: BarcodeSerialMode) => void;
    onAddSerial: (id: string, serial: string) => boolean;
    onRemoveSerial: (id: string, serial: string) => void;
}

const INPUT = "rounded-md border border-brand-subtext/30 bg-white px-2 py-1 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-emerald-500";

const MODES: { value: BarcodeSerialMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "auto", label: "Auto", icon: Wand2 },
    { value: "manual", label: "Manual", icon: Keyboard },
];

export const CreateBarcodeQueueRow = React.memo(function CreateBarcodeQueueRow({
    item, onRemove, onQuantityChange, onSkuChange, onMrpChange, onSerialModeChange, onAddSerial, onRemoveSerial,
}: CreateBarcodeQueueRowProps) {
    const [serialInput, setSerialInput] = React.useState("");
    const isManual = item.serialMode === "manual";

    // Scanners type the code and press Enter, so Enter adds and keeps focus for the next scan.
    const handleSerialKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") {
            return;
        }
        e.preventDefault();
        if (onAddSerial(item.id, serialInput)) {
            setSerialInput("");
        }
    };

    return (
        <>
            <TableRow className="hover:bg-white transition-colors">
                <TableCell>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-brand-text">{item.productName}</span>
                        <span className="text-[10px] font-bold text-emerald-600">{item.variant}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <input
                        type="text"
                        value={item.sku}
                        onChange={(e) => onSkuChange(item.id, e.target.value)}
                        placeholder={isManual ? "Optional" : "Required for auto"}
                        className={`${INPUT} w-36 font-mono`}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-brand-subtext">৳</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.mrpText}
                            onChange={(e) => onMrpChange(item.id, e.target.value)}
                            placeholder="0.00"
                            className={`${INPUT} w-28`}
                        />
                    </div>
                </TableCell>
                <TableCell>
                    <div className="inline-flex rounded-md border border-brand-subtext/30 bg-white p-0.5">
                        {MODES.map((mode) => {
                            const Icon = mode.icon;
                            const isActive = item.serialMode === mode.value;
                            return (
                                <button
                                    key={mode.value}
                                    type="button"
                                    onClick={() => onSerialModeChange(item.id, mode.value)}
                                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-bold transition-colors ${isActive ? "bg-emerald-600 text-white" : "text-brand-subtext hover:bg-brand-bg"}`}
                                >
                                    <Icon className="h-3 w-3" /> {mode.label}
                                </button>
                            );
                        })}
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        disabled={isManual}
                        title={isManual ? "Equals the number of serials entered" : undefined}
                        onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                        className={`${INPUT} w-16 text-center mx-auto disabled:cursor-not-allowed disabled:bg-gray-50`}
                    />
                </TableCell>
                <TableCell className="text-right">
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </TableCell>
            </TableRow>

            {isManual && (
                <TableRow className="bg-white/60">
                    <TableCell colSpan={6}>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={serialInput}
                                onChange={(e) => setSerialInput(e.target.value)}
                                onKeyDown={handleSerialKeyDown}
                                placeholder="Type or scan a serial / IMEI and press Enter"
                                className={`${INPUT} w-full max-w-md py-2 font-mono`}
                            />
                            {item.manualSerials.length === 0 ? (
                                <p className="text-xs text-amber-600">No serials entered yet. Each serial becomes one barcode.</p>
                            ) : (
                                <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto custom-scrollbar">
                                    {item.manualSerials.map((serial) => (
                                        <span key={serial} className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-700">
                                            {serial}
                                            <button type="button" onClick={() => onRemoveSerial(item.id, serial)} className="text-emerald-700/70 hover:text-red-600" title="Remove serial">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
});

CreateBarcodeQueueRow.displayName = "CreateBarcodeQueueRow";
