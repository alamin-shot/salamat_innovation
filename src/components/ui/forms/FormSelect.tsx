import * as React from "react";
import { FormSelectProps } from "@/types/form";
import { ChevronDown } from "lucide-react";

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, error, helperText, options, placeholder, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-semibold text-brand-text">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        className={`appearance-none flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-brand-text transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500 focus:border-red-500" : "border-brand-subtext/30 focus:border-brand-primary"
                            } ${className}`}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                </div>

                {error && <span className="text-xs font-medium text-red-500 animate-in fade-in">{error}</span>}
                {!error && helperText && <span className="text-xs text-brand-subtext">{helperText}</span>}
            </div>
        );
    }
);

FormSelect.displayName = "FormSelect";