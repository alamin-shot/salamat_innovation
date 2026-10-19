import { CheckCircle2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useTelesalesFormManager } from "@/hooks/telesales_hooks/useTelesalesFormManager";
import { TelesalesFormFields } from "./TelesalesFormFields";
import { TelesaleRecord } from "@/hooks/telesales_hooks/useTelesalesManager";

export function TelesalesFormDrawer({
    mode,
    id,
    initialRecord,
    isOpen,
    onClose,
}: {
    mode: "create" | "edit";
    id?: string | null;
    initialRecord?: TelesaleRecord | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useTelesalesFormManager(mode, initialRecord, onClose);

    if (!isOpen) return null;

    return (
        <Drawer
            title={mode === "edit" ? "Update Telesale" : "Add Telesale"}
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
                    <TelesalesFormFields manager={manager} mode={mode} />

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-6 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="success"
                            onClick={manager.handleSave}
                            className="px-6"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Save
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}