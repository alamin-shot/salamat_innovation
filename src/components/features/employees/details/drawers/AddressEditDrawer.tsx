"use client";
import { useState, useEffect } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { BD_COUNTRIES, BD_DISTRICTS, BD_AREAS_BY_DISTRICT, resolveAreaDetails } from "@/utils/bdGeography";
import { AddressDetail } from "@/types/employee.types";

export function AddressEditDrawer({ manager }: { manager: EmployeeDetailManagerType }) {
    const isOpen = manager.activeSubDrawer === "edit_address";
    const emp = manager.employee;

    const [res, setRes] = useState<AddressDetail>({ ...emp.residentialAddress });
    const [perm, setPerm] = useState<AddressDetail>({ ...emp.permanentAddress });
    const [sameAs, setSameAs] = useState(emp.sameAsResidential);

    useEffect(() => {
        if (isOpen) {
            setRes({ ...emp.residentialAddress });
            setPerm({ ...emp.permanentAddress });
            setSameAs(emp.sameAsResidential);
        }
    }, [isOpen, emp]);

    const handleResAreaChange = (area: string) => {
        const { thana, postalCode } = resolveAreaDetails(res.district, area);
        setRes((prev) => ({ ...prev, area, thana, postalCode }));
    };

    const handlePermAreaChange = (area: string) => {
        const { thana, postalCode } = resolveAreaDetails(perm.district, area);
        setPerm((prev) => ({ ...prev, area, thana, postalCode }));
    };

    const handleSave = () => {
        manager.saveAddressInfo(res, perm, sameAs);
    };

    const renderAddressBlock = (title: string, color: string, addr: AddressDetail, setAddr: (val: any) => void, onAreaChange: (val: string) => void, disabled: boolean) => (
        <div className={`flex flex-col gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className={`text-xs font-bold text-${color}-600 uppercase tracking-wider flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${color}-500`}></span> {title}
                </div>
                {title === "Permanent Address" && (
                    <label className="flex items-center gap-2 text-gray-700 text-xs font-normal cursor-pointer normal-case pointer-events-auto">
                        <input type="checkbox" checked={sameAs} onChange={(e) => setSameAs(e.target.checked)} className="rounded text-brand-primary" />
                        Same as Residential
                    </label>
                )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Country</label>
                    <CustomSelect value={addr.country} options={BD_COUNTRIES} onChange={(val) => setAddr((p: any) => ({ ...p, country: val }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">District</label>
                    <CustomSelect value={addr.district} options={BD_DISTRICTS[addr.country] || []} onChange={(val) => setAddr((p: any) => ({ ...p, district: val, area: "", thana: "", postalCode: "" }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Area</label>
                    <CustomSelect value={addr.area} options={(BD_AREAS_BY_DISTRICT[addr.district] || []).map(a => a.area)} onChange={onAreaChange} placeholder="Select Area" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Thana</label>
                    <input type="text" className="erp-input bg-gray-50 text-gray-500" placeholder="Auto-filled from Area" value={addr.thana} readOnly />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Postal Code</label>
                    <input type="text" className="erp-input bg-gray-50 text-gray-500" placeholder="Auto-filled from Area" value={addr.postalCode} readOnly />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="erp-label">Street Address</label>
                    <textarea className="erp-input h-10 resize-none py-2" placeholder={`Enter ${title.toLowerCase()}`} value={addr.streetAddress} onChange={(e) => setAddr((p: any) => ({ ...p, streetAddress: e.target.value }))} />
                </div>
            </div>
        </div>
    );

    return (
        <Drawer title="Edit Address Information" isOpen={isOpen} onClose={manager.closeSubDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-8">
                    {renderAddressBlock("Residential Address", "emerald", res, setRes, handleResAreaChange, false)}
                    {renderAddressBlock("Permanent Address", "indigo", perm, setPerm, handlePermAreaChange, sameAs)}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeSubDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </Drawer>
    );
}