"use client";
import { usePeopleManager } from "@/hooks/usePeopleManager";
import { PeopleTable } from "./PeopleTable";
import { ViewPeopleDrawer } from "./view-drawer/ViewPeopleDrawer";
import { PeopleFormDrawer } from "./form-drawer/PeopleFormDrawer";

export function PeopleClient() {
    const manager = usePeopleManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">People</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <PeopleTable manager={manager} />
            </div>

            <ViewPeopleDrawer
                id={manager.retainedViewId}
                person={manager.activePerson}
                activeTab={manager.activeDetailTab}
                onTabChange={manager.setActiveDetailTab}
                isOpen={manager.activeDrawer === "view-people"}
                onClose={manager.closeView}
            />

            <PeopleFormDrawer
                mode="create"
                isOpen={manager.activeDrawer === "create-people"}
                onClose={manager.closeView}
            />

            <PeopleFormDrawer
                mode="edit"
                id={manager.retainedEditId}
                isOpen={manager.activeDrawer === "edit-people"}
                onClose={manager.closeView}
            />
        </div>
    );
}