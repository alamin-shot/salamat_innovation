"use client";
import Image from "next/image";
import { Camera, Check, Phone, Smartphone, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { SellDeviceManagerType } from "@/hooks/sell_device_hooks/useSellDeviceManager";
import { SellDeviceStatus } from "@/types/sellDevice";
import { formatAbsolute } from "@/utils/dateDisplay";

const STEPS: SellDeviceStatus[] = ["Pending", "Contacted"];

/** Where the request sits in Pending → Contacted → Approved / Rejected (from its current status only). */
function StatusSteps({ status }: { status: SellDeviceStatus }) {
    const final = status === "Approved" || status === "Rejected" ? status : null;
    const reached = (step: SellDeviceStatus) => final !== null || STEPS.indexOf(step) <= STEPS.indexOf(status);
    const steps: { label: string; done: boolean; tone: string }[] = [
        ...STEPS.map((step) => ({ label: step, done: reached(step), tone: "bg-emerald-600" })),
        { label: final ?? "Decision", done: final !== null, tone: final === "Rejected" ? "bg-rose-600" : "bg-emerald-600" },
    ];
    return (
        <ol className="flex items-center gap-2">
            {steps.map((step, index) => (
                <li key={step.label} className="flex flex-1 items-center gap-2">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${step.done ? step.tone : "bg-gray-200 text-gray-500"}`}>
                        {step.done ? (step.label === "Rejected" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />) : index + 1}
                    </span>
                    <span className={`text-xs font-semibold ${step.done ? "text-gray-800" : "text-gray-400"}`}>{step.label}</span>
                    {index < steps.length - 1 && <span className={`h-0.5 flex-1 rounded ${steps[index + 1].done ? "bg-emerald-300" : "bg-gray-200"}`} />}
                </li>
            ))}
        </ol>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
            <p className="mt-0.5 text-sm font-medium text-gray-800">{value || "—"}</p>
        </div>
    );
}

/** Read-only inspection of a sell request: device, condition photos and the customer's quote. */
export function SellDeviceInspectDrawer({ manager }: { manager: SellDeviceManagerType }) {
    const request = manager.getActiveRequest();
    const isOpen = manager.activeDrawer === "inspect";

    return (
        <Drawer title={request ? `Sell Request ${request.requestId}` : "Sell Request"} isOpen={isOpen} onClose={manager.closeDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            {request && (
                <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-4 bg-gray-50/50 p-4 pb-32">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <StatusSteps status={request.status} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Device */}
                        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700"><Smartphone className="h-4 w-4 text-emerald-600" /> Device Specifications</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Brand" value={request.deviceBrand} />
                                <Field label="Model" value={request.deviceModel} />
                                <Field label="RAM / Storage" value={request.ramStorage} />
                                <Field label="Reported Condition" value={request.condition} />
                            </div>
                        </section>

                        {/* Quote */}
                        <section className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Customer&apos;s Expected Price</span>
                                <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">৳{request.expectedPrice.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</span>
                                <p className="mt-0.5 text-sm font-semibold text-gray-800">{request.customerName}</p>
                                <a href={`tel:${request.phone}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"><Phone className="h-3.5 w-3.5" /> {request.phone}</a>
                            </div>
                            <Field label="Submitted" value={formatAbsolute(request.createdAt)} />
                        </section>
                    </div>

                    {/* Condition photos */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700"><Camera className="h-4 w-4 text-emerald-600" /> Condition Photos ({request.photos.length})</h3>
                        {request.photos.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">No photos were sent with this request.</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {request.photos.map((src, index) => (
                                    <a key={src} href={src} target="_blank" rel="noreferrer" className="relative block aspect-square overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                        <Image src={src} alt={`Condition photo ${index + 1}`} fill unoptimized className="object-cover transition-transform hover:scale-105" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Staff note */}
                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h3 className="mb-2 text-sm font-bold text-gray-700">Negotiation &amp; Evaluation Notes</h3>
                        {request.adminNote ? <p className="whitespace-pre-line text-sm text-gray-700">{request.adminNote}</p> : <p className="text-sm text-gray-400">No notes yet. Use Edit to add one.</p>}
                    </section>
                </div>
            )}
        </Drawer>
    );
}
