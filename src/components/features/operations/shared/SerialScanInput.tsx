import * as React from "react";
import { ScanLine } from "lucide-react";

interface SerialScanInputProps {
    value: string;
    onChange: (value: string) => void;
    onScan: () => void;
}

/** Scanner-friendly serial box: a barcode scanner types the serial and presses Enter. */
export function SerialScanInput({ value, onChange, onScan }: SerialScanInputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
            <label className="text-[13px] text-gray-500 font-medium">Scan or type a serial number</label>
            <div className="relative">
                <ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onScan();
                        }
                    }}
                    placeholder="Serial / IMEI, then Enter"
                    className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-3 text-[13px] text-gray-600 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
            </div>
            <p className="text-[11px] text-gray-400">Only in-stock units (Received / Transferred) can be added; product details fill in from Barcodes.</p>
        </div>
    );
}
