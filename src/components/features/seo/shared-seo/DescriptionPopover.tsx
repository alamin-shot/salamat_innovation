"use client";
import { useState, useRef, useEffect } from "react";
import { Eye } from "lucide-react";

export function DescriptionPopover({ description }: { description: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!description || description.trim() === "") {
        return <span className="text-gray-400 font-medium">-</span>;
    }

    return (
        <div className="relative flex items-center" ref={popoverRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-emerald-600 transition-colors p-1 rounded-md hover:bg-emerald-50"
            >
                <Eye className="h-[18px] w-[18px]" />
            </button>

            {isOpen && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 w-72 bg-white border border-gray-200 shadow-xl rounded-lg p-4 text-[13px] text-gray-700 whitespace-pre-wrap animate-in fade-in zoom-in-95">
                    <div className="font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">Description</div>
                    {description}
                </div>
            )}
        </div>
    );
}