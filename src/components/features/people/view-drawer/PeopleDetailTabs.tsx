import {
    User,
    MapPin,
    Star,
    ShoppingBag,
    ListOrdered,
    Heart,
    MessageSquare,
    Smartphone,
    Phone,
    Mail,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const TABS = [
    { id: "overview", label: "Overview", icon: User },
    { id: "address", label: "Address Book", icon: MapPin },
    { id: "elite", label: "Elite Histories", icon: Star },
    { id: "bag", label: "Shopping Bag", icon: ShoppingBag },
    { id: "orders", label: "Order History", icon: ListOrdered },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "sell", label: "Sell Device Requests", icon: Smartphone },
];

export function PeopleDetailTabs({
    person,
    activeTab,
    onTabChange,
}: {
    person: any;
    activeTab: string;
    onTabChange: (tabId: string) => void;
}) {
    return (
        <div className="flex flex-col gap-5 mt-6">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-2">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <Button
                            key={tab.id}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onTabChange(tab.id)}
                            className={`gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${isActive
                                ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 rounded-b-none"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{tab.label}</span>
                        </Button>
                    );
                })}
            </div>

            {/* Tab Body */}
            {activeTab === "overview" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Contact Information Card */}
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 bg-indigo-50/40 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" /> Contact Information
                        </div>
                        <div className="flex flex-col divide-y divide-gray-100 p-4">
                            <div className="flex items-center gap-3 pb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Phone Number</span>
                                    <span className="text-xs font-semibold text-gray-800">{person.phoneNumber}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Email</span>
                                    <span className="text-xs font-semibold text-gray-800">{person.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information Card */}
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 bg-indigo-50/40 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                            <User className="h-3.5 w-3.5" /> Personal Information
                        </div>
                        <div className="p-4 text-xs text-gray-500 flex flex-col gap-2">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-gray-400 block">Business Name</span>
                                <span className="text-xs font-semibold text-gray-800">{person.businessName}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase text-gray-400 block">Rating</span>
                                <span className="text-xs font-semibold text-gray-800">{person.rating}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Card */}
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 bg-indigo-50/40 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" /> Account Information
                        </div>
                        <div className="flex flex-col divide-y divide-gray-100 p-4">
                            <div className="flex items-center gap-3 pb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Email Verified</span>
                                    <span className="text-xs font-bold text-amber-600">Not Verified</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Joined</span>
                                    <span className="text-xs font-semibold text-gray-800">{person.createdAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                    No records found in {TABS.find((t) => t.id === activeTab)?.label}.
                </div>
            )}
        </div>
    );
}