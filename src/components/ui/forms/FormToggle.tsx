import * as React from "react";
import { FormToggleProps } from "@/types/form";

export const FormToggle = React.forwardRef<HTMLInputElement, FormToggleProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                <label className="group relative flex cursor-pointer items-center gap-3">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            ref={ref}
                            {...props}
                        />
                        {/* The Switch Track */}
                        <div className="h-6 w-11 rounded-full bg-brand-subtext/30 transition-colors peer-checked:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                        {/* The Switch Knob */}
                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                    </div>

                    {label && (
                        <span className="text-sm font-medium text-brand-text select-none group-disabled:opacity-50">
                            {label}
                        </span>
                    )}
                </label>

                {error && <span className="text-xs font-medium text-red-500 animate-in fade-in">{error}</span>}
                {!error && helperText && <span className="text-xs text-brand-subtext">{helperText}</span>}
            </div>
        );
    }
);

FormToggle.displayName = "FormToggle";