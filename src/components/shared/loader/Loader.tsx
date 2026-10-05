import * as React from "react";
import { cn } from "@/lib/utils";

export function Loader({ 
  className, 
  variant = "inline" 
}: { 
  className?: string, 
  variant?: "inline" | "fullscreen" | "section" 
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        {
          "fixed inset-0 z-50 bg-brand-bg/80 backdrop-blur-sm": variant === "fullscreen",
          "w-full h-full min-h-[200px]": variant === "section",
        },
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  );
}
