"use client";
import * as React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft,
    AlignCenter, AlignRight, AlignJustify, Quote, Undo, Redo,
    Link2, Unlink, Palette, Table, Rows3, Columns3, Trash2, Check
} from "lucide-react";
import { RichTextEditorProps } from "@/types/editor";

// Brand swatches offered first in the text colour picker.
const TEXT_COLORS = ["#111827", "#0caa8d", "#06a98c", "#f06b25", "#dc2626", "#2563eb", "#6b7280"];

// Without the typography plugin, the editing area needs its own element styles.
const CONTENT_CLASS = [
    "max-w-none min-h-[150px] p-4 text-sm text-brand-text focus:outline-none focus:ring-0",
    "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2",
    "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2",
    "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2",
    "[&_p]:my-1",
    "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
    "[&_blockquote]:border-l-4 [&_blockquote]:border-brand-subtext/30 [&_blockquote]:pl-3 [&_blockquote]:italic",
    "[&_a]:text-emerald-600 [&_a]:underline",
    "[&_table]:my-2 [&_table]:w-full [&_table]:border-collapse",
    "[&_td]:border [&_td]:border-brand-subtext/30 [&_td]:p-2 [&_td]:align-top",
    "[&_th]:border [&_th]:border-brand-subtext/30 [&_th]:bg-brand-bg/60 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold",
].join(" ");

const toggleClass = (isActive: boolean) =>
    `p-1.5 rounded-md transition-colors ${isActive ? "bg-brand-primary/10 text-brand-primary" : "text-brand-subtext hover:bg-brand-bg hover:text-brand-text"}`;

const ACTION_CLASS = "p-1.5 rounded-md text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text disabled:opacity-30 disabled:hover:bg-transparent";

const Divider = () => <div className="mx-1 w-px h-5 bg-brand-subtext/20" />;

// --- Link entry (inline, no browser prompt) ---
const LinkControl = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [url, setUrl] = React.useState("");

    const open = () => {
        setUrl(editor.getAttributes("link").href ?? "https://");
        setIsOpen(true);
    };

    const apply = () => {
        const href = url.trim();
        if (href === "" || href === "https://") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
        }
        setIsOpen(false);
    };

    return (
        <div className="relative flex items-center">
            <button type="button" onClick={open} className={toggleClass(editor.isActive("link"))} title="Insert link">
                <Link2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} className={ACTION_CLASS} title="Remove link">
                <Unlink className="h-4 w-4" />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-50 flex w-72 items-center gap-1.5 rounded-lg border border-brand-subtext/20 bg-white p-2 shadow-xl">
                    <input
                        autoFocus
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); apply(); }
                            if (e.key === "Escape") setIsOpen(false);
                        }}
                        className="w-full rounded-md border border-brand-subtext/30 px-2 py-1 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                    <button type="button" onClick={apply} className="rounded-md bg-emerald-600 p-1.5 text-white hover:bg-emerald-700" title="Apply link">
                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

// --- Text colour picker ---
const ColorControl = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const current: string = editor.getAttributes("textStyle").color ?? "";

    const applyColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
        setIsOpen(false);
    };

    return (
        <div className="relative flex items-center">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={toggleClass(current !== "")} title="Text colour">
                <Palette className="h-4 w-4" style={current ? { color: current } : undefined} />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-50 flex items-center gap-1.5 rounded-lg border border-brand-subtext/20 bg-white p-2 shadow-xl">
                    {TEXT_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => applyColor(color)}
                            className={`h-5 w-5 rounded-full border ${current === color ? "ring-2 ring-emerald-500 ring-offset-1" : "border-brand-subtext/30"}`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                    <label className="relative h-5 w-5 cursor-pointer overflow-hidden rounded-full border border-brand-subtext/30 bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]" title="Custom colour">
                        <input type="color" value={current || "#111827"} onChange={(e) => applyColor(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                    <button type="button" onClick={() => { editor.chain().focus().unsetColor().run(); setIsOpen(false); }} className="ml-1 text-[11px] font-semibold text-brand-subtext hover:text-brand-text">
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

// --- The Custom Toolbar Component ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const inTable = editor.isActive("table");

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
            <ColorControl editor={editor} />

            <Divider />

            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={toggleClass(editor.isActive("heading", { level: 1 }))}>
                <Heading1 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={toggleClass(editor.isActive("heading", { level: 2 }))}>
                <Heading2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={toggleClass(editor.isActive("heading", { level: 3 }))}>
                <Heading3 className="h-4 w-4" />
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
            <LinkControl editor={editor} />

            <Divider />

            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={toggleClass(editor.isActive({ textAlign: 'left' }))}>
                <AlignLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={toggleClass(editor.isActive({ textAlign: 'center' }))}>
                <AlignCenter className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={toggleClass(editor.isActive({ textAlign: 'right' }))}>
                <AlignRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={toggleClass(editor.isActive({ textAlign: 'justify' }))}>
                <AlignJustify className="h-4 w-4" />
            </button>

            <Divider />

            <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={ACTION_CLASS} title="Insert table">
                <Table className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!inTable} className={ACTION_CLASS} title="Add row">
                <Rows3 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!inTable} className={ACTION_CLASS} title="Add column">
                <Columns3 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!inTable} className={ACTION_CLASS} title="Delete table">
                <Trash2 className="h-4 w-4" />
            </button>

            <Divider />

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
export function RichTextEditor({ label, error, helperText, value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // StarterKit (v3) already bundles Underline and Link.
            StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            TableKit.configure({ table: { resizable: false } }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: CONTENT_CLASS,
                ...(placeholder ? { "aria-placeholder": placeholder } : {}),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-semibold text-brand-text">{label}</label>}

            <div className={`rounded-md border transition-colors focus-within:ring-2 focus-within:ring-brand-primary/50 ${error ? "border-red-500 focus-within:border-red-500" : "border-brand-subtext/30 focus-within:border-brand-primary"
                }`}>
                <MenuBar editor={editor} />
                {/* Fixed-height body: long content scrolls instead of stretching the form. */}
                <div className="h-64 overflow-y-auto bg-white custom-scrollbar">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {error && <span className="text-xs font-medium text-red-500 animate-in fade-in">{error}</span>}
            {!error && helperText && <span className="text-xs text-brand-subtext">{helperText}</span>}
        </div>
    );
}
