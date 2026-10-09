"use client";
import * as React from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";

interface BrandReorderListProps {
    onBack: () => void;
}

const INITIAL_REORDER_BRANDS = [
    { id: "brand-1", name: "Apple", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Apple" },
    { id: "brand-2", name: "Google", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Google" },
    { id: "brand-3", name: "SAMSUNG", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Samsung" },
    { id: "brand-4", name: "Xiaomi", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Xiaomi" },
    { id: "brand-5", name: "Nothing", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Nothing" },
    { id: "brand-6", name: "CMF", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=CMF" },
    { id: "brand-7", name: "MOTOROLA", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Moto" },
    { id: "brand-8", name: "Honor", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Honor" },
    { id: "brand-9", name: "IQOO", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=IQOO" },
    { id: "brand-10", name: "ONEPLUS", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=1%2B" },
    { id: "brand-11", name: "Realme", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Realme" },
    { id: "brand-12", name: "OPPO", logo: "https://placehold.co/100x100/e2e8f0/64748b?text=OPPO" },
];

export function BrandReorderList({ onBack }: BrandReorderListProps) {
    const [brands, setBrands] = React.useState(INITIAL_REORDER_BRANDS);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => setIsMounted(true), []);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(brands);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setBrands(items);
        toast.success("Brand order updated.");
    };

    if (!isMounted) return null;

    return (
        <div className="flex h-full flex-col bg-brand-bg/30">
            {/* Header matching legacy reorder bar */}
            <div className="shrink-0 flex items-center justify-between border-b border-brand-subtext/20 bg-white px-6 py-4">
                <h2 className="text-base font-bold text-brand-text">Reorder Brands</h2>
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 shadow-sm"
                >
                    Back to Brands
                </button>
            </div>

            {/* Draggable Brands Container */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mx-auto max-w-4xl">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="brands-reorder-list">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-col gap-3 pb-8"
                                >
                                    {brands.map((brand, index) => (
                                        <Draggable key={brand.id} draggableId={brand.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`flex items-center gap-4 rounded-xl border p-3.5 transition-colors select-none ${snapshot.isDragging
                                                            ? "border-emerald-500 bg-white shadow-xl ring-2 ring-emerald-500/20"
                                                            : "border-brand-subtext/20 bg-white hover:border-emerald-300 shadow-sm"
                                                        }`}
                                                >
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="text-brand-subtext hover:text-brand-text transition-colors cursor-grab active:cursor-grabbing"
                                                        title="Drag to reorder"
                                                    >
                                                        <GripVertical className="h-5 w-5" />
                                                    </div>

                                                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-brand-subtext/15 bg-brand-bg">
                                                        <Image
                                                            src={brand.logo}
                                                            alt={brand.name}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </div>

                                                    <span className="text-sm font-semibold text-brand-text">
                                                        {brand.name}
                                                    </span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}