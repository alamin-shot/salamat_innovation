"use client";
import { Button } from "@/components/ui/Button";
import { Save, RotateCcw } from "lucide-react";

export function SettingsDraftFooter({
    isDirty,
    isValid,
    onSave,
    onDiscard
}: {
    isDirty: boolean;
    isValid: boolean;
    onSave: () => void;
    onDiscard: () => void;
}) {
    if (!isDirty) return null;

    return (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
            <div className="flex flex-col">
                <span className="text-sm font-bold">Unsaved Changes Detected</span>
                <span className="text-xs text-gray-400">You have modified configurations on this page.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={onDiscard}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button variant="default" className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={onSave} disabled={!isValid}>
                    <Save className="w-4 h-4 mr-2" /> Save Settings
                </Button>
            </div>
        </div>
    );
}