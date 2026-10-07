"use client";
import * as React from "react";
import { X } from "lucide-react";
import { DrawerProps } from "@/types/ui";

export function Drawer({
    title,
    isOpen,
    onClose,
    children,
    width = "w-[400px] sm:w-[540px]"
}: DrawerProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            // 10ms delay forces the browser to paint the hidden state first,
            // guaranteeing the slide-in animation fires every time.
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            // Wait 500ms for the slide-out animation to finish before removing from DOM
            const timer = setTimeout(() => setIsMounted(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isMounted) return null;

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-brand-text/30 backdrop-blur-[2px] transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${width} ${isVisible ? "translate-x-0" : "translate-x-full"
                    }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-brand-subtext/20 p-4 lg:px-6">
                    <h2 className="text-lg font-bold tracking-tight text-brand-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
                    {children}
                </div>
            </div>
        </>
    );
}