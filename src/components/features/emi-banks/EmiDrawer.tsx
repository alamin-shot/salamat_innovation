"use client";
import { useState, useEffect } from "react";
import { EmiManagerType } from "@/hooks/emi_hooks/useEmiManager";
import { EmiBank, TenureRate } from "@/store/useEmiStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

const DEFAULT_TENURES: TenureRate[] = [
    { tenure: "3 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "6 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "9 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "12 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "18 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "24 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "30 Months", enabled: false, chargeRate: 0, active: true },
    { tenure: "36 Months", enabled: false, chargeRate: 0, active: true },
];

export function EmiDrawer({ manager }: { manager: EmiManagerType }) {
    const isEditing = manager.activeDrawer === "edit";
    const activeBank = manager.getActiveBank();

    const [formData, setFormData] = useState<Omit<EmiBank, "id">>({
        bankName: "",
        gatewayKey: "",
        status: "Active",
        tenureRates: JSON.parse(JSON.stringify(DEFAULT_TENURES))
    });

    useEffect(() => {
        if (isEditing && activeBank) {
            setFormData(JSON.parse(JSON.stringify(activeBank)));
        } else if (manager.activeDrawer === "add") {
            setFormData({
                bankName: "",
                gatewayKey: "",
                status: "Active",
                tenureRates: JSON.parse(JSON.stringify(DEFAULT_TENURES))
            });
        }
    }, [isEditing, activeBank, manager.activeDrawer]);

    const handleBankNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            bankName: name,
            gatewayKey: manager.generateGatewayKey(name)
        }));
    };

    const updateTenureRow = (index: number, field: keyof TenureRate, value: any) => {
        setFormData(prev => {
            const updated = [...prev.tenureRates];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, tenureRates: updated };
        });
    };

    const handleSubmit = () => {
        if (!formData.bankName.trim()) return alert("Bank Name is required");
        manager.handleSubmit(formData);
    };

    return (
        <Drawer
            title={isEditing ? "Edit EMI Bank" : "Add EMI Bank"}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5 sm:col-span-1">
                            <label className="erp-label">Bank Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. AB Bank PLC"
                                value={formData.bankName}
                                onChange={(e) => handleBankNameChange(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-1">
                            <label className="erp-label">Gateway Key <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="erp-input bg-gray-50"
                                placeholder="e.g. abbank"
                                value={formData.gatewayKey}
                                onChange={(e) => setFormData({ ...formData, gatewayKey: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-1">
                            <label className="erp-label">Status <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={formData.status}
                                options={["Active", "Inactive"]}
                                onChange={(val) => setFormData({ ...formData, status: val as any })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Tenure Rates</h3>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm text-gray-700">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 w-24 text-center">Enable</th>
                                        <th className="px-4 py-3">Tenure</th>
                                        <th className="px-4 py-3">Charge Rate (%)</th>
                                        <th className="px-4 py-3 w-28 text-center">Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.tenureRates.map((item, index) => (
                                        <tr key={item.tenure} className="bg-white hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer h-4 w-4"
                                                    checked={item.enabled}
                                                    onChange={(e) => updateTenureRow(index, "enabled", e.target.checked)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.tenure}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="erp-input h-8 max-w-xs"
                                                    placeholder="e.g. 3.09"
                                                    disabled={!item.enabled}
                                                    value={item.chargeRate || ""}
                                                    onChange={(e) => updateTenureRow(index, "chargeRate", parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer h-4 w-4"
                                                    checked={item.active}
                                                    disabled={!item.enabled}
                                                    onChange={(e) => updateTenureRow(index, "active", e.target.checked)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save</Button>
                </div>
            </div>
        </Drawer>
    );
}