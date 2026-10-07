import * as React from "react";
import { FormInputProps } from "@/types/form";

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-semibold text-brand-text">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-brand-text transition-colors placeholder:text-brand-subtext/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500 focus:border-red-500" : "border-brand-subtext/30 focus:border-brand-primary"
                        } ${className}`}
                    {...props}
                />

                {error && <span className="text-xs font-medium text-red-500 animate-in fade-in">{error}</span>}
                {!error && helperText && <span className="text-xs text-brand-subtext">{helperText}</span>}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";