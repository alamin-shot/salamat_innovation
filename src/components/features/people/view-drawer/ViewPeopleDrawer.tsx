import { Drawer } from "@/components/ui/Drawer";
import { usePersonLifecycle } from "@/hooks/people_hooks/usePersonLifecycle";
import { PersonRecord } from "@/types/people";
import { PeopleProfileHeader } from "./PeopleProfileHeader";
import { PeopleDetailTabs } from "./PeopleDetailTabs";

export function ViewPeopleDrawer({
    person,
    activeTab,
    onTabChange,
    isOpen,
    onClose,
}: {
    person: PersonRecord | null;
    activeTab: string;
    onTabChange: (tabId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { lifecycle } = usePersonLifecycle(person?.id ?? null);
    const title = person?.type === "Supplier" ? "Supplier Details" : "Customer Details";

    return (
        <Drawer title={title} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {person ? (
                <div className="p-4 bg-gray-50/50 min-h-full pb-32">
                    <PeopleProfileHeader person={person} lifecycle={lifecycle} />
                    <PeopleDetailTabs person={person} lifecycle={lifecycle} activeTab={activeTab} onTabChange={onTabChange} />
                </div>
            ) : (
                <div className="m-4 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-sm text-gray-500">
                    This profile no longer exists.
                </div>
            )}
        </Drawer>
    );
}
