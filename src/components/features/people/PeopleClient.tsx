"use client";
import { usePeopleManager } from "@/hooks/people_hooks/usePeopleManager";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { PeopleFormMode } from "@/hooks/people_hooks/usePeopleFormManager";
import { PeopleTable } from "./PeopleTable";
import { ViewPeopleDrawer } from "./view-drawer/ViewPeopleDrawer";
import { PeopleFormDrawer } from "./form-drawer/PeopleFormDrawer";

export function PeopleClient() {
    const manager = usePeopleManager();

    // "Add Customer" / "Add Supplier" share one drawer; the origin is kept while it slides out.
    const createOrigin = manager.activeDrawer === "create-customer" ? "people_add_customer" : manager.activeDrawer === "create-supplier" ? "people_add_supplier" : null;
    const isCreateOpen = createOrigin !== null;
    const retainedOrigin = useRetainedValue(createOrigin, isCreateOpen);
    const createMode: PeopleFormMode | null = retainedOrigin ? { kind: "create", origin: retainedOrigin } : null;
    const editMode: PeopleFormMode | null = manager.activeEditPerson ? { kind: "edit", person: manager.activeEditPerson } : null;

    return (
        <div className="flex flex-col w-full min-h-full p-4 relative">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">People</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex flex-col">
                <PeopleTable manager={manager} />
            </div>

            <ViewPeopleDrawer
                person={manager.activePerson}
                activeTab={manager.activeDetailTab}
                onTabChange={manager.setActiveDetailTab}
                isOpen={manager.isViewOpen}
                onClose={manager.closeView}
            />

            <PeopleFormDrawer mode={createMode} isOpen={isCreateOpen} onClose={manager.closeView} />
            <PeopleFormDrawer mode={editMode} isOpen={manager.isEditOpen} onClose={manager.closeView} />
        </div>
    );
}
