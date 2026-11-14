import * as React from "react";
import { OrderStatusFilter } from "@/types/ordersHub";
import { ORDER_STATUS_FLOW } from "@/constants/hub";

interface OrderStatusChipsProps {
    status: OrderStatusFilter;
    counts: Record<OrderStatusFilter, number>;
    onChange: (status: OrderStatusFilter) => void;
}

const FILTERS: OrderStatusFilter[] = ["All", ...ORDER_STATUS_FLOW];

/** Status filter row of the Orders spoke, in workflow order, with live counts. */
export function OrderStatusChips({ status, counts, onChange }: OrderStatusChipsProps) {
    return (
        <div role="tablist" aria-label="Order status" className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {FILTERS.map((filter) => {
                const isActive = filter === status;
                return (
                    <button
                        key={filter}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(filter)}
                        className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${isActive
                            ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                            : "border-brand-subtext/20 bg-white text-brand-subtext hover:border-brand-primary/40 hover:text-brand-text"}`}
                    >
                        {filter === "All" ? "All Orders" : filter}
                        <span className={`rounded-full px-1.5 text-[11px] ${isActive ? "bg-brand-primary text-white" : "bg-brand-subtext/10"}`}>{counts[filter]}</span>
                    </button>
                );
            })}
        </div>
    );
}
