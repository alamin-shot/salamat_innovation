import { CheckCircle2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { PeopleFormMode, usePeopleFormManager } from "@/hooks/people_hooks/usePeopleFormManager";
import { PeopleBasicFields } from "./PeopleBasicFields";
import { PeopleAddressFields } from "./PeopleAddressFields";

function PeopleFormBody({ mode, onClose }: { mode: PeopleFormMode; onClose: () => void }) {
    const manager = usePeopleFormManager(mode, onClose);

    return (
        <div className="p-4 bg-gray-50/50 min-h-full pb-32">
            <div className="flex flex-col gap-2 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
                <PeopleBasicFields manager={manager} />
                <hr className="border-gray-100" />
                <PeopleAddressFields manager={manager} />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} className="px-6 text-gray-700 hover:bg-gray-50">
                        Cancel
                    </Button>
                    <Button variant="success" onClick={manager.handleSave} className="px-6">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Add Customer / Add Supplier / Edit drawer. `mode` is null while nothing is loaded (e.g. an edit link
 * to a deleted profile); the body is keyed so every opening starts from fresh values.
 */
export function PeopleFormDrawer({ mode, isOpen, onClose }: { mode: PeopleFormMode | null; isOpen: boolean; onClose: () => void }) {
    const title = !mode ? "Edit People" : mode.kind === "edit" ? `Edit ${mode.person.type}` : mode.origin === "people_add_supplier" ? "Add Supplier" : "Add Customer";
    const key = !mode ? "none" : mode.kind === "edit" ? `edit-${mode.person.id}` : mode.origin;

    return (
        <Drawer title={title} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {mode && <PeopleFormBody key={key} mode={mode} onClose={onClose} />}
        </Drawer>
    );
}
