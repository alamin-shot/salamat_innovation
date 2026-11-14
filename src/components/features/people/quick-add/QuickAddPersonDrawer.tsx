"use client";
import * as React from "react";
import { UserPlus } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useCreatePerson } from "@/hooks/people_hooks/useCreatePerson";
import { PersonOrigin, PersonRecord } from "@/types/people";

interface QuickAddPersonDrawerProps {
    /** The creating context; it fixes the type (e.g. POS → Offline Customer). */
    origin: PersonOrigin;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onCreated: (person: PersonRecord) => void;
}

const INPUT = "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

function QuickAddPersonForm({ origin, onCancel, onCreated }: { origin: PersonOrigin; onCancel: () => void; onCreated: (person: PersonRecord) => void }) {
    const { create, type } = useCreatePerson(origin);
    const [name, setName] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [businessName, setBusinessName] = React.useState("");
    const [address, setAddress] = React.useState("");

    const save = () => {
        const person = create({ name, phoneNumber, businessName, address });
        if (person) onCreated(person);
    };

    return (
        <div className="flex flex-col gap-5 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-[12px] text-gray-500">
                Will be saved as <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">{type}</span>
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-1.5"><span className="text-[13px] font-medium text-gray-600">Name <span className="text-red-500">*</span></span><input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className="text-[13px] font-medium text-gray-600">Phone <span className="text-red-500">*</span></span><input type="tel" className={INPUT} value={phoneNumber} placeholder="01XXXXXXXXX" onChange={(e) => setPhoneNumber(e.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className="text-[13px] font-medium text-gray-600">Business Name</span><input className={INPUT} value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className="text-[13px] font-medium text-gray-600">Address</span><input className={INPUT} value={address} onChange={(e) => setAddress(e.target.value)} /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <Button variant="outline" onClick={onCancel} className="px-6">Cancel</Button>
                <Button variant="success" onClick={save} className="gap-2 px-6"><UserPlus className="h-4 w-4" /> Save</Button>
            </div>
        </div>
    );
}

/** Create a person from inside another flow; the new profile is handed back to that flow. */
export function QuickAddPersonDrawer({ origin, title, isOpen, onClose, onCreated }: QuickAddPersonDrawerProps) {
    return (
        <Drawer title={title} isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {isOpen && (
                <div className="pb-32">
                    <QuickAddPersonForm origin={origin} onCancel={onClose} onCreated={onCreated} />
                </div>
            )}
        </Drawer>
    );
}
