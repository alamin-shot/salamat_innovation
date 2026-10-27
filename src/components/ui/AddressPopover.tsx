"use client";
import { useState } from "react";
import { Eye } from "lucide-react";

export function AddressPopover({ address }: { address: string }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!address) return <span className="text-gray-400">-</span>;

    return (
        <div className="relative flex items-center gap-2">
            <span className="truncate max-w-[120px] text-gray-600 text-sm" title={address}>
                {address}
            </span>
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="text-blue-500 hover:text-blue-700 focus:outline-none bg-blue-50 p-1 rounded-md"
            >
                <Eye className="h-3.5 w-3.5" />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-white border border-gray-200 shadow-xl rounded-lg">
                    <div className="text-xs font-bold text-gray-800 mb-1 border-b border-gray-100 pb-1">Address</div>
                    <div className="text-xs text-gray-600 whitespace-normal leading-relaxed">
                        {address}
                    </div>
                </div>
            )}
        </div>
    );
}