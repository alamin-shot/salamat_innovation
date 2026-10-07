"use client";
import * as React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, List, ListOrdered, AlignLeft,
    AlignCenter, AlignRight, Quote, Undo, Redo
} from "lucide-react";
import { RichTextEditorProps } from "@/types/editor";

// --- The Custom Toolbar Component ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const toggleClass = (isActive: boolean) =>
        `p-1.5 rounded-md transition-colors ${isActive ? "bg-brand-primary/10 text-brand-primary" : "text-brand-subtext hover:bg-brand-bg hover:text-brand-text"
        }`;

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-brand-subtext/20 bg-brand-bg/20 p-2">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={toggleClass(editor.isActive("bold"))}>
                <Bold className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={toggleClass(editor.isActive("italic"))}>
                <Italic className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={toggleClass(editor.isActive("underline"))}>
                <UnderlineIcon className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={toggleClass(editor.isActive("strike"))}>
                <Strikethrough className="h-4 w-4" />
            </button>

            <div className="mx-1 w-px h-5 bg-brand-subtext/20" />

            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={toggleClass(editor.isActive("heading", { level: 1 }))}>
                <Heading1 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={toggleClass(editor.isActive("heading", { level: 2 }))}>
                <Heading2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={toggleClass(editor.isActive("bulletList"))}>
                <List className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={toggleClass(editor.isActive("orderedList"))}>
                <ListOrdered className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={toggleClass(editor.isActive("blockquote"))}>
                <Quote className="h-4 w-4" />
            </button>

            <div className="mx-1 w-px h-5 bg-brand-subtext/20" />

            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={toggleClass(editor.isActive({ textAlign: 'left' }))}>
                <AlignLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={toggleClass(editor.isActive({ textAlign: 'center' }))}>
                <AlignCenter className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={toggleClass(editor.isActive({ textAlign: 'right' }))}>
                <AlignRight className="h-4 w-4" />
            </button>

            <div className="mx-1 w-px h-5 bg-brand-subtext/20" />

            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1.5 text-brand-subtext hover:text-brand-text disabled:opacity-30">
                <Undo className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1.5 text-brand-subtext hover:text-brand-text disabled:opacity-30">
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
};

// --- The Main Editor Container ---
export function RichTextEditor({ label, error, helperText, value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: value,
        editorProps: {
            attributes: {
                // This class targets the actual typing area
                class: 'prose prose-sm max-w-none min-h-[150px] p-4 focus:outline-none focus:ring-0',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-semibold text-brand-text">{label}</label>}

            <div className={`overflow-hidden rounded-md border transition-colors focus-within:ring-2 focus-within:ring-brand-primary/50 ${error ? "border-red-500 focus-within:border-red-500" : "border-brand-subtext/30 focus-within:border-brand-primary"
                }`}>
                <MenuBar editor={editor} />
                <EditorContent editor={editor} className="bg-white" />
            </div>

            {error && <span className="text-xs font-medium text-red-500 animate-in fade-in">{error}</span>}
            {!error && helperText && <span className="text-xs text-brand-subtext">{helperText}</span>}
        </div>
    );
}