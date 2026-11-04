"use client";
import { useBadgeValueManager } from "@/hooks/payroll_hooks/useBadgeValueManager";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Save, Plus, Trash2, Info } from "lucide-react";
import { ComputationBase } from "@/types/payroll.types";

export function BadgeValueClient() {
    const manager = useBadgeValueManager();

    // Group beneficiaries for dropdowns
    const allowBens = manager.activeBeneficiaries.filter(b => b.type === "Allowance");
    const dedBens = manager.activeBeneficiaries.filter(b => b.type === "Deduction");
    const statBens = manager.activeBeneficiaries.filter(b => b.type === "Statutory");

    // Group active local badges to render in their respective panes
    const allowBadges = manager.localBadges.filter(b => allowBens.some(ab => ab.id === b.beneficiaryId));
    const dedBadges = manager.localBadges.filter(b => dedBens.some(db => db.id === b.beneficiaryId));
    const statBadges = manager.localBadges.filter(b => statBens.some(sb => sb.id === b.beneficiaryId));

    const renderBadgeRow = (badge: any, benOptions: any[]) => {
        const benMap = benOptions.map(b => b.name);
        const currentName = benOptions.find(b => b.id === badge.beneficiaryId)?.name || benMap[0];

        return (
            <div key={badge.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-2xs group hover:border-gray-300 transition">
                <div className="flex-1">
                    <CustomSelect
                        value={currentName}
                        options={benMap}
                        onChange={(val) => {
                            const newBen = benOptions.find(b => b.name === val);
                            if (newBen) manager.updateBadge(badge.id, "beneficiaryId", newBen.id);
                        }}
                    />
                </div>

                <div className="w-32">
                    <input
                        type="number"
                        className="erp-input text-right font-mono font-bold"
                        value={badge.amount}
                        onChange={(e) => manager.updateBadge(badge.id, "amount", Number(e.target.value))}
                    />
                </div>

                <div className="w-40">
                    <CustomSelect
                        value={badge.computationBase}
                        options={["Fixed Amount", "Percent of Basic", "Percent of Gross"]}
                        onChange={(val) => manager.updateBadge(badge.id, "computationBase", val as ComputationBase)}
                    />
                </div>

                <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.removeBadge(badge.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">

            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Badge Values (Payroll Rules)</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Assign default mathematical values to active Beneficiaries for the Payrun Engine.
                    </p>
                </div>
                <Button variant="default" onClick={manager.handleSaveAll} className="h-9 flex items-center gap-1.5 shadow-md">
                    <Save className="w-4 h-4" /> Save Configuration
                </Button>
            </div>

            <div className="erp-card bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-900 leading-relaxed">
                    <strong>How Computation Works:</strong><br />
                    Badge values configured here act as the <strong>global default</strong> during Payrun Generation. If you select <strong>"Percent of Basic"</strong>, the engine will dynamically calculate the exact value based on each employee's individual base salary profile during the run.
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-6">

                {/* LEFT PANE: Earnings */}
                <div className="flex-1 flex flex-col gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                        <h2 className="text-sm font-bold text-emerald-800 tracking-wide uppercase">Earnings & Allowances</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{allowBadges.length} Assigned</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {allowBadges.map(b => renderBadgeRow(b, allowBens))}
                    </div>

                    <Button variant="outline" onClick={() => manager.addBadge("Allowance")} className="mt-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Allowance Rule
                    </Button>
                </div>

                {/* RIGHT PANE: Deductions & Statutory */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* Deductions */}
                    <div className="flex flex-col gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                            <h2 className="text-sm font-bold text-rose-800 tracking-wide uppercase">Standard Deductions</h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">{dedBadges.length} Assigned</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {dedBadges.map(b => renderBadgeRow(b, dedBens))}
                        </div>
                        <Button variant="outline" onClick={() => manager.addBadge("Deduction")} className="mt-2 border-dashed border-rose-300 text-rose-700 hover:bg-rose-50">
                            <Plus className="w-4 h-4 mr-1.5" /> Add Deduction Rule
                        </Button>
                    </div>

                    {/* Statutory */}
                    <div className="flex flex-col gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between pb-2 border-b border-indigo-200">
                            <h2 className="text-sm font-bold text-indigo-800 tracking-wide uppercase">Statutory (Taxes & Gov)</h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{statBadges.length} Assigned</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {statBadges.map(b => renderBadgeRow(b, statBens))}
                        </div>
                        <Button variant="outline" onClick={() => manager.addBadge("Statutory")} className="mt-2 border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                            <Plus className="w-4 h-4 mr-1.5" /> Add Statutory Rule
                        </Button>
                    </div>

                </div>

            </div>
        </div>
    );
}