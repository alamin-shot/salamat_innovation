"use client";
import { Bold, Italic, Underline, Link2, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
}

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="erp-label">{label} <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-shadow">
                <div className="flex items-center gap-2 bg-gray-50 border-b border-gray-200 p-2">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Underline className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600"><Link2 className="w-4 h-4" /></button>
                </div>
                <textarea
                    className="w-full h-32 p-3 text-sm text-gray-800 focus:outline-none resize-none"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter rich text content here..."
                />
            </div>
        </div>
    );
}