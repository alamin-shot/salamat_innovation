"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Columns3, Check, RotateCcw } from "lucide-react";

export interface ColumnConfig {
    key: string;
    label: string;
}

interface ColumnsVisibilityDropdownProps {
    columns: ColumnConfig[];
    visibleColumns: Record<string, boolean>;
    onToggleColumn: (key: string) => void;
    onReset: () => void;
}

export function ColumnsVisibilityDropdown({
    columns,
    visibleColumns,
    onToggleColumn,
    onReset,
}: ColumnsVisibilityDropdownProps) {
    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex w-full lg:w-auto cursor-pointer select-none items-center justify-between lg:justify-start gap-2 rounded-lg border border-brand-subtext/20 bg-white px-3 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-brand-bg/80 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 data-[state=open]:bg-brand-bg/80">
                <Columns3 className="h-4 w-4 text-brand-subtext" />
                <span>Columns</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
                    {visibleCount}
                </span>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className="z-[120] w-56 rounded-xl border border-brand-subtext/20 bg-white p-2 shadow-2xl max-h-[280px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95"
                >
                    <div className="mb-2 flex items-center justify-between px-2 pt-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-subtext">
                            Toggle Columns
                        </span>
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1 text-xs font-medium text-brand-primary transition-colors hover:underline"
                        >
                            <RotateCcw className="h-3 w-3" /> Reset
                        </button>
                    </div>

                    <DropdownMenu.Separator className="mb-1 h-px bg-brand-subtext/10" />

                    <div className="flex flex-col gap-0.5">
                        {columns.map((col) => {
                            const isVisible = visibleColumns[col.key] ?? true;
                            return (
                                <DropdownMenu.Item
                                    key={col.key}
                                    onSelect={(e) => {
                                        e.preventDefault(); // Keep dropdown open while toggling multiple items
                                        onToggleColumn(col.key);
                                    }}
                                    className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-brand-bg text-brand-text"
                                >
                                    <span className={isVisible ? "font-medium" : "text-brand-subtext line-through"}>
                                        {col.label}
                                    </span>
                                    <div
                                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${isVisible
                                            ? "border-brand-primary bg-brand-primary text-white"
                                            : "border-brand-subtext/30 bg-transparent"
                                            }`}
                                    >
                                        {isVisible && <Check className="h-3 w-3 stroke-[3]" />}
                                    </div>
                                </DropdownMenu.Item>
                            );
                        })}
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}