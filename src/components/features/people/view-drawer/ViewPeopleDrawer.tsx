import { Drawer } from "@/components/ui/Drawer";
import { PeopleProfileHeader } from "./PeopleProfileHeader";
import { PeopleDetailTabs } from "./PeopleDetailTabs";

export function ViewPeopleDrawer({
    id,
    person,
    activeTab,
    onTabChange,
    isOpen,
    onClose,
}: {
    id: string | null;
    person: any;
    activeTab: string;
    onTabChange: (tabId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}) {
    const fallbackPerson = person || {
        id: id || "1",
        initials: "Y",
        name: "Yasin",
        email: "yasin8999@gmail.com",
        phoneNumber: "+8801608797891",
        businessName: "—",
        status: "Active",
        rating: "Unrated",
        createdAt: "1 hour ago",
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Customer Details"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <PeopleProfileHeader person={fallbackPerson} />
                <PeopleDetailTabs
                    person={fallbackPerson}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />
            </div>
        </Drawer>
    );
}