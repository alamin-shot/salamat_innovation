import * as React from "react";
import { CheckCircle2, Lock, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOrderFormManager } from "@/hooks/order_confirmation_hooks/useOrderFormManager";

type Manager = ReturnType<typeof useOrderFormManager>;

const INPUT = "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none h-9";

/**
 * Phone-first customer: the number is looked up in People.
 * Found → profile linked, name locked. Not found → "Add Customer Directly" (no dropdown).
 */
export function OrderCustomerSection({ manager }: { manager: Manager }) {
    const { customerResolution: resolution } = manager;
    const { lookup } = resolution;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Customer Phone <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="tel"
                        value={manager.customerPhone}
                        onChange={(e) => manager.setCustomerPhone(e.target.value)}
                        placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                        className={`${INPUT} pl-9`}
                    />
                </div>
                {lookup.status === "invalid" && <p className="text-[11px] text-rose-600">Not a valid Bangladeshi mobile number yet.</p>}
            </div>

            <div className="md:col-span-2">
                {lookup.status === "matched" && (
                    <div className="flex h-full items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-2.5" role="status">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-emerald-800">
                                <Lock className="h-3.5 w-3.5" /> {lookup.person.name}
                            </p>
                            <p className="truncate text-[11px] text-emerald-700">{lookup.person.type} · {lookup.person.phoneNumber} · profile linked, name locked</p>
                        </div>
                    </div>
                )}

                {lookup.status === "not_found" && (
                    <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                        <p className="text-[12px] font-medium text-amber-800">No customer with {lookup.normalizedPhone}. Add them to People, then save the order.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={manager.customer}
                                onChange={(e) => manager.setCustomer(e.target.value)}
                                placeholder="Customer name"
                                className={INPUT}
                            />
                            <Button type="button" variant="success" onClick={manager.addCustomerDirectly} className="shrink-0 gap-1.5">
                                <UserPlus className="h-4 w-4" /> Add Customer Directly
                            </Button>
                        </div>
                        <p className="text-[11px] text-amber-700">Saved as an <b>{manager.onlineOffline === "Online" ? "Online" : "Offline"} Customer</b> (follows the order&apos;s Online / Offline setting).</p>
                    </div>
                )}

                {(lookup.status === "empty" || lookup.status === "invalid") && (
                    <div className="flex h-full items-center rounded-lg border border-dashed border-gray-200 px-4 py-2.5 text-[12px] text-gray-500">
                        Enter the customer&apos;s mobile number to find their profile.
                    </div>
                )}
            </div>
        </div>
    );
}
