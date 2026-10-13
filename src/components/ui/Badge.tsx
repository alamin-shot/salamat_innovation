"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "success" | "destructive" | "warning" | "default";
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
    const variants = {
        success: "bg-emerald-100/60 text-emerald-700 border-emerald-200",
        destructive: "bg-red-100/60 text-red-700 border-red-200",
        warning: "bg-yellow-100/60 text-yellow-700 border-yellow-200",
        default: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
        <span
            className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium", variants[variant], className)}
            {...props}
        >
            {children}
        </span>
    );
}