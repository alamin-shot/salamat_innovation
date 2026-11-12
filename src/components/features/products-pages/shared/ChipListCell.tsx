"use client";
import * as React from "react";
import { Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

export interface ChipListItem {
    key: string;
    label: string;
}

interface ChipListCellProps {
    items: ChipListItem[];
    chipClassName: string;
    /** Called with the trimmed label once it passes the empty / duplicate checks. */
    onAdd: (label: string) => void;
    addTitle: string;
    placeholder: string;
    /** Chips shown while collapsed; the rest sit behind a "+N more" toggle. */
    visibleLimit?: number;
}

/**
 * Chip list with an Add control that always stays visible on the right.
 * The chips are capped while collapsed and scroll inside a fixed height when expanded,
 * so a row with thousands of values never pushes the Add control out of reach.
 */
export const ChipListCell = React.memo(function ChipListCell({
    items, chipClassName, onAdd, addTitle, placeholder, visibleLimit = 8,
}: ChipListCellProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isAdding, setIsAdding] = React.useState(false);
    const [draft, setDraft] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const hiddenCount = Math.max(items.length - visibleLimit, 0);
    const visibleItems = isExpanded ? items : items.slice(0, visibleLimit);

    React.useEffect(() => {
        if (isAdding) inputRef.current?.focus();
    }, [isAdding]);

    const closeAdd = () => {
        setIsAdding(false);
        setDraft("");
    };

    const submit = () => {
        const label = draft.trim();
        if (!label) {
            closeAdd();
            return;
        }
        if (items.some((item) => item.label.toLowerCase() === label.toLowerCase())) {
            toast.error(`"${label}" already exists.`);
            return;
        }
        onAdd(label);
        toast.success(`"${label}" added.`);
        // Stay open so several values can be added in a row.
        setDraft("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        } else if (e.key === "Escape") {
            closeAdd();
        }
    };

    return (
        <div className="flex items-start gap-2 py-1">
            <div
                className={`flex min-w-0 flex-1 flex-wrap items-center gap-1.5 ${
                    isExpanded && hiddenCount > 0 ? "max-h-40 overflow-y-auto custom-scrollbar pr-1" : ""
                }`}
            >
                {visibleItems.map((item) => (
                    <span key={item.key} className={chipClassName}>
                        {item.label}
                    </span>
                ))}

                {hiddenCount > 0 && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
                    >
                        {isExpanded ? "Show less" : `+${hiddenCount} more`}
                    </button>
                )}
            </div>

            <div className="shrink-0">
                {isAdding ? (
                    <div className="flex items-center gap-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-36 rounded-md border border-brand-subtext/30 bg-white px-2 py-1 text-xs text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                            type="button"
                            onClick={submit}
                            title="Save"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-emerald-600 transition-colors hover:bg-emerald-50"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={closeAdd}
                            title="Cancel"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        title={addTitle}
                        className="inline-flex items-center gap-1 rounded-md border border-dashed border-emerald-300 px-2 py-1 text-xs font-bold text-emerald-700 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                )}
            </div>
        </div>
    );
});

ChipListCell.displayName = "ChipListCell";
