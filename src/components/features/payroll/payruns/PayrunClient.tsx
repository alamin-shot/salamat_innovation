"use client";
import { usePayrunManager } from "@/hooks/payroll_hooks/usePayrunManager";
import { PayrunHeader } from "./PayrunHeader";
import { PayrunGrid } from "./PayrunGrid";
import { PayrunWizard } from "./PayrunWizard";

export function PayrunClient() {
    const manager = usePayrunManager();

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">
            {manager.view === "wizard" ? (
                <PayrunWizard manager={manager} />
            ) : (
                <>
                    <PayrunHeader manager={manager} />
                    <PayrunGrid manager={manager} />
                </>
            )}
        </div>
    );
}