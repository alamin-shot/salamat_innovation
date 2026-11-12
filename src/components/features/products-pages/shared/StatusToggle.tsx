"use client";
import * as React from "react";

interface StatusToggleProps {
    checked: boolean;
    onChange: () => void;
    /** Text shown beside the switch, e.g. "Active" / "Inactive". Omit for a bare switch. */
    label?: string;
    title?: string;
    disabled?: boolean;
}

/** One-click on/off switch used in the status columns of every Products table. */
export const StatusToggle = React.memo(function StatusToggle({ checked, onChange, label, title, disabled = false }: StatusToggleProps) {
    return (
        <label className={`inline-flex items-center gap-2 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`} title={title}>
            <input
                type="checkbox"
                role="switch"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="peer sr-only"
            />
            <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative shadow-sm"></div>
            {label && (
                <span className={`text-xs font-semibold ${checked ? "text-emerald-700" : "text-brand-subtext"}`}>
                    {label}
                </span>
            )}
        </label>
    );
});

StatusToggle.displayName = "StatusToggle";
