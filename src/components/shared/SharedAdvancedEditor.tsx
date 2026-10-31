"use client";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";

// Dynamically import Jodit to strictly prevent Next.js hydration and SSR errors
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface SharedAdvancedEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export function SharedAdvancedEditor({ value, onChange }: SharedAdvancedEditorProps) {
    const editor = useRef(null);

    // Configuration mapping to the dense toolbar requested
    const config = useMemo(() => ({
        readonly: false,
        height: 600,
        toolbarSticky: true,
        style: {
            fontFamily: "inherit",
        },
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'brush', '|',
            'ul', 'ol', 'outdent', 'indent', '|',
            'align', 'table', 'link', 'image', 'video', '|',
            'hr', 'eraser', 'copyformat', '|',
            'undo', 'redo', 'source', 'fullsize'
        ]
    }), []);

    return (
        <div className="w-full border border-gray-200 rounded-md overflow-hidden bg-white focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-shadow">
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                onBlur={(newContent) => onChange(newContent)} // Using onBlur prevents heavy re-renders on every keystroke
            />
        </div>
    );
}