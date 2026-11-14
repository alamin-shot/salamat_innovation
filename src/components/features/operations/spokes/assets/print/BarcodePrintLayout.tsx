"use client";
import React from "react";
import { Asset } from "@/types/assets.types";
import { QrCode } from "lucide-react"; // In production, swap with a real QR generator library

interface BarcodePrintLayoutProps {
    assetsToPrint: Asset[];
}

export const BarcodePrintLayout = React.forwardRef<HTMLDivElement, BarcodePrintLayoutProps>(
    ({ assetsToPrint }, ref) => {

        // JIT Rendering: If no assets, return empty DOM to save massive memory
        if (!assetsToPrint || assetsToPrint.length === 0) return null;

        return (
            <div className="hidden">
                <div ref={ref} className="bg-white w-[210mm] min-h-[297mm] p-10 flex flex-wrap gap-4 content-start text-black">
                    {/* Injecting strict print media styles via inline block */}
                    <style type="text/css" media="print">
                        {`
                        @page { size: A4; margin: 10mm; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        `}
                    </style>

                    {assetsToPrint.map((asset) => (
                        <div key={asset.id} className="w-[85mm] h-[45mm] border-2 border-black rounded-lg p-3 flex flex-row items-center gap-3 bg-white">
                            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border border-gray-300 rounded shrink-0">
                                {/* Simulated QR Code */}
                                <QrCode className="w-12 h-12 text-black" />
                            </div>
                            <div className="flex flex-col h-full justify-center">
                                <h2 className="text-sm font-black uppercase leading-tight mb-1">{asset.name}</h2>
                                <p className="text-[10px] font-mono font-bold">{asset.assetCode}</p>
                                <p className="text-[9px]">SN: {asset.serialNumber}</p>
                                <p className="text-[9px] mt-auto">Salamat Innovation Group</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

BarcodePrintLayout.displayName = "BarcodePrintLayout";