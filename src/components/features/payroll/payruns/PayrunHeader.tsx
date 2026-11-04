"use client";
import { Button } from "@/components/ui/Button";
import { Play } from "lucide-react";
import { usePayrunManager } from "@/hooks/payroll_hooks/usePayrunManager";

export function PayrunHeader({ manager }: { manager: ReturnType<typeof usePayrunManager> }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Payruns</h1>
                <p className="text-xs text-gray-500 mt-0.5">Automated payroll execution engine.</p>
            </div>
            <Button variant="default" onClick={() => manager.setView("wizard")} className="flex items-center gap-1.5 h-9 shadow-md">
                <Play className="w-4 h-4" /> Run Payroll
            </Button>
        </div>
    );
}