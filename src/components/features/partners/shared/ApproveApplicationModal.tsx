import { BadgeCheck, X } from "lucide-react";
import { Partner, ApprovedPartnerType } from "@/types/partners";
import { APPROVE_TARGETS, PARTNER_TYPE_LABELS } from "@/constants/partners";

/** "Approve as…": moves the application into the chosen partner list as Active. */
export function ApproveApplicationModal({ application, onApprove, onClose }: { application: Partner; onApprove: (type: ApprovedPartnerType) => void; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Approve application">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Close"><X className="h-4 w-4" /></button>
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><BadgeCheck className="h-5 w-5" /></div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Approve application</h2>
                        <p className="text-sm text-gray-500">{application.businessName} · {application.name}</p>
                    </div>
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Approve as</p>
                <div className="grid grid-cols-2 gap-3">
                    {APPROVE_TARGETS.map((type) => (
                        <button key={type} type="button" onClick={() => onApprove(type)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800">
                            {PARTNER_TYPE_LABELS[type].one}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
