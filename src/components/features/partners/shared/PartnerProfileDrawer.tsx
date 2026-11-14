import Link from "next/link";
import { Building2, FileBadge, History, Mail, MapPin, Phone } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Partner } from "@/types/partners";
import { PARTNER_LIST_PATHS, PARTNER_TYPE_LABELS } from "@/constants/partners";
import { formatAbsolute, formatDay, formatRelative } from "@/utils/dateDisplay";
import { PartnerLogo, PartnerStatusBadge, PartnerTierBadge } from "./PartnerBits";

const show = (value: string) => (value && value !== "-" ? value : "—");

function Detail({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500"><Icon className="h-4 w-4" /></div>
            <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
                <span className="block break-words text-sm font-medium text-gray-800">{value}</span>
            </div>
        </div>
    );
}

/** Partner profile: identity, business details, trade licence and the status history. */
export function PartnerProfileDrawer({ partner, currentType, isOpen, onClose }: { partner: Partner | null; currentType: Partner["type"]; isOpen: boolean; onClose: () => void }) {
    return (
        <Drawer title="Partner Profile" isOpen={isOpen} onClose={onClose} width="w-full sm:w-[calc(100vw-260px)]">
            {partner && (
                <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-4 bg-gray-50/50 p-4 pb-32">
                    {/* Identity card */}
                    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-emerald-50/40 p-6 shadow-sm sm:flex-row sm:items-center">
                        <PartnerLogo name={partner.businessName || partner.name} logoUrl={partner.logoUrl} size="lg" />
                        <div className="flex flex-1 flex-col gap-2">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{partner.businessName}</h2>
                                <p className="text-sm text-gray-600">{partner.name}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-[11px] font-bold text-white">{PARTNER_TYPE_LABELS[partner.type].one}</span>
                                <PartnerTierBadge tier={partner.tier} />
                                <PartnerStatusBadge status={partner.status} />
                            </div>
                            {partner.type !== currentType && (
                                <Link href={PARTNER_LIST_PATHS[partner.type]} className="text-xs font-semibold text-emerald-700 hover:underline">
                                    Now listed under {PARTNER_TYPE_LABELS[partner.type].many} →
                                </Link>
                            )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                            <span className="block">Partner since</span>
                            <span className="block text-sm font-semibold text-gray-800">{formatDay(partner.createdAt)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <section className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-700">Contact</h3>
                            <Detail icon={Phone} label="Primary Phone" value={show(partner.primaryPhone)} />
                            <Detail icon={Phone} label="Secondary Phone" value={show(partner.secondaryPhone)} />
                            <Detail icon={Mail} label="Email" value={show(partner.email)} />
                        </section>
                        <section className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-700">Business</h3>
                            <Detail icon={Building2} label="Business Name" value={show(partner.businessName)} />
                            <Detail icon={FileBadge} label="Trade License" value={show(partner.tradeLicense)} />
                            <Detail icon={MapPin} label="Address" value={show(partner.address)} />
                        </section>
                    </div>

                    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700"><History className="h-4 w-4 text-emerald-600" /> Status History</h3>
                        <ol className="relative flex flex-col gap-4 border-l-2 border-gray-100 pl-5">
                            {[...partner.history].reverse().map((entry, index) => (
                                <li key={`${entry.at}-${index}`} className="relative">
                                    <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${index === 0 ? "bg-emerald-500" : "bg-gray-300"}`} />
                                    <p className="text-sm font-medium text-gray-800">{entry.event}</p>
                                    <p className="text-xs text-gray-400" title={formatAbsolute(entry.at)} suppressHydrationWarning>{formatRelative(entry.at)}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
            )}
        </Drawer>
    );
}
