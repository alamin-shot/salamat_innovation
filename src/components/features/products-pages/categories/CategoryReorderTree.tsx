"use client";
import * as React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Folder, Smartphone, Monitor, Plus, Minus, Hash, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryReorderTreeProps {
    onSelectCategory: (id: string) => void;
    activeId: string | null;
}

// Updated Mock Data with nested children to match the exact visual requirement
const NESTED_CATEGORIES = [
    { id: "cat-1", name: "Electronic Devices", icon: Monitor, children: [] },
    {
        id: "cat-2",
        name: "Mobile and Tablets",
        icon: Smartphone,
        children: [
            { id: "sub-1", name: "iPhone", icon: Smartphone },
            { id: "sub-2", name: "Smart Phones", icon: Smartphone },
            { id: "sub-3", name: "Galaxy", icon: Smartphone },
            { id: "sub-4", name: "Pixel", icon: Smartphone },
            { id: "sub-5", name: "iPad", icon: Smartphone },
        ]
    },
    { id: "cat-3", name: "Electronic Accessories", icon: Folder, children: [] },
    { id: "cat-4", name: "Appliances", icon: Folder, children: [] },
    { id: "cat-5", name: "Computers and Laptops", icon: Monitor, children: [] },
];

export function CategoryReorderTree({ onSelectCategory, activeId }: CategoryReorderTreeProps) {
    const [categories, setCategories] = React.useState(NESTED_CATEGORIES);
    const [expandedIds, setExpandedIds] = React.useState<string[]>(["cat-2"]); // Default open to show nesting
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => setIsMounted(true), []);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCategories(items);
    };

    const toggleExpand = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    if (!isMounted) return null;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories-root">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-col gap-2 pb-10"
                    >
                        {categories.map((cat, index) => (
                            <Draggable key={cat.id} draggableId={cat.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="flex flex-col gap-2"
                                    >
                                        {/* PARENT ROW */}
                                        <div
                                            onClick={() => onSelectCategory(cat.id)}
                                            className={`flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer select-none ${activeId === cat.id
                                                ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500"
                                                : snapshot.isDragging
                                                    ? "border-brand-subtext/40 bg-white shadow-lg"
                                                    : "border-brand-subtext/20 bg-white hover:border-emerald-300"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div {...provided.dragHandleProps} className="text-brand-subtext hover:text-brand-text transition-colors">
                                                    <GripVertical className="h-5 w-5" />
                                                </div>
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-bg/50 border border-brand-subtext/10 text-brand-text">
                                                    <cat.icon className="h-4 w-4" />
                                                </div>
                                                <span className={`text-sm font-bold ${activeId === cat.id ? "text-emerald-800" : "text-brand-text"}`}>
                                                    {cat.name}
                                                </span>
                                            </div>

                                            {/* Expand/Collapse Button (Matches Screenshot + / - ) */}
                                            {cat.children.length > 0 ? (
                                                <button
                                                    onClick={(e) => toggleExpand(e, cat.id)}
                                                    className="flex h-6 w-6 items-center justify-center text-brand-subtext hover:text-brand-text transition-colors"
                                                >
                                                    {expandedIds.includes(cat.id) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                                </button>
                                            ) : (
                                                <div className="h-6 w-6 text-brand-subtext/30 flex items-center justify-center"><Minus className="h-4 w-4" /></div>
                                            )}
                                        </div>

                                        {/* CHILDREN ROWS */}
                                        {expandedIds.includes(cat.id) && cat.children.length > 0 && (
                                            <div className="ml-10 flex flex-col gap-2 mt-1 mb-2">
                                                {cat.children.map((child) => (
                                                    <div
                                                        key={child.id}
                                                        onClick={() => onSelectCategory(child.id)}
                                                        className={`flex items-center justify-between rounded-lg border p-2 pl-3 transition-colors cursor-pointer select-none ${activeId === child.id
                                                            ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500"
                                                            : "border-brand-subtext/20 bg-white hover:border-emerald-300"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-brand-subtext/40 cursor-not-allowed">
                                                                <Hash className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex h-6 w-6 items-center justify-center rounded text-brand-text">
                                                                <child.icon className="h-3 w-3" />
                                                            </div>
                                                            <span className={`text-sm font-medium ${activeId === child.id ? "text-emerald-800" : "text-brand-text"}`}>
                                                                {child.name}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-50 text-brand-subtext hover:text-red-500 transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); toast.error("Delete sub-category..."); }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}