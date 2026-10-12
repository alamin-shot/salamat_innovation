"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Plus, Check, Tag as TagIcon } from "lucide-react";

// The available tags based on your old 3-dot menu
const AVAILABLE_TAGS = [
    { id: "featured", label: "Featured", color: "text-amber-500" },
    { id: "coming_soon", label: "Coming Soon", color: "text-blue-500" },
    { id: "arrival", label: "New Arrival", color: "text-purple-500" },
    { id: "official", label: "Official", color: "text-green-500" },
    { id: "unofficial", label: "Unofficial", color: "text-orange-500" },
    { id: "chinese", label: "Chinese", color: "text-red-500" },
    { id: "refurbished", label: "Refurbished", color: "text-slate-500" },
];

interface ProductTagsDropdownProps {
    productId: string;
    initialTags?: string[];
}

export function ProductTagsDropdown({ productId, initialTags = [] }: ProductTagsDropdownProps) {
    const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set(initialTags));

    const handleToggleTag = (tagId: string) => {
        const next = new Set(selectedTags);
        if (next.has(tagId)) next.delete(tagId);
        else next.add(tagId);
        setSelectedTags(next);
        // Here you would also fire an API call to update the backend instantly
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="group flex h-6 items-center gap-1.5 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 text-xs font-medium text-brand-text transition-colors hover:bg-brand-primary/10 hover:border-brand-primary/30 focus:outline-none">
                {selectedTags.size > 0 ? (
                    <>
                        <TagIcon className="h-3 w-3 text-brand-primary" />
                        <span>{selectedTags.size} Tags</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-3 w-3 text-brand-subtext group-hover:text-brand-primary" />
                        <span className="text-brand-subtext group-hover:text-brand-primary">Add Tag</span>
                    </>
                )}
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="start"
                    sideOffset={4}
                    className="z-[100] w-48 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95"
                >
                    <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-subtext">
                        Apply Tags
                    </div>
                    {AVAILABLE_TAGS.map((tag) => {
                        const isSelected = selectedTags.has(tag.id);
                        return (
                            <DropdownMenu.CheckboxItem
                                key={tag.id}
                                checked={isSelected}
                                onCheckedChange={() => handleToggleTag(tag.id)}
                                onSelect={(e) => e.preventDefault()} // Keeps dropdown open after clicking
                                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-brand-bg data-[state=checked]:bg-brand-primary/5"
                            >
                                <span className={`font-medium ${isSelected ? tag.color : "text-brand-text"}`}>
                                    {tag.label}
                                </span>
                                {isSelected && <Check className="h-4 w-4 text-brand-primary" />}
                            </DropdownMenu.CheckboxItem>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}