"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "success" | "warning" | "destructive" | "secondary" | "destructive-ghost";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50",
          {
            // Core Variants
            "bg-brand-primary text-white hover:bg-brand-primary/90": variant === "default",
            "border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700": variant === "outline",
            "hover:bg-gray-100 text-gray-700": variant === "ghost",
            "text-brand-primary underline-offset-4 hover:underline": variant === "link",

            // New App-Specific Variants
            "bg-[#108c5d] text-white hover:bg-emerald-700 shadow-sm": variant === "success",
            "bg-[#eab308] text-white hover:bg-yellow-600 shadow-sm": variant === "warning",
            "bg-red-500 text-white hover:bg-red-600 shadow-sm": variant === "destructive",
            "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200": variant === "secondary",
            "text-gray-400 hover:text-red-600 hover:bg-red-50": variant === "destructive-ghost",

            // Sizes
            "h-9 px-4 py-2 text-[13px]": size === "default",
            "h-8 px-3 text-[12px]": size === "sm",
            "h-10 px-8 text-[14px]": size === "lg",
            "h-9 w-9": size === "icon",
            "h-7 w-7": size === "icon-sm",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };