"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { AddressEditDrawer } from "../drawers/AddressEditDrawer";
import { Button } from "@/components/ui/Button";
import { MapPin, Home, Edit } from "lucide-react";

export function AddressInfoTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const emp = manager.employee;
    const { residentialAddress, permanentAddress } = emp;

    const renderAddress = (addr: typeof residentialAddress) => {
        if (!addr.streetAddress && !addr.area) {
            return (
                <div className="flex flex-col items-center justify-center py-8 opacity-50">
                    <Home className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-xs text-gray-500">No address added yet.</span>
                </div>
            );
        }
        return (
            <div className="flex flex-col gap-3 mt-4">
                <div className="text-sm text-gray-900 leading-relaxed font-medium">
                    {addr.streetAddress}
                </div>
                <div className="text-sm text-gray-600">
                    {addr.area && `${addr.area}, `}
                    {addr.thana && `${addr.thana}, `}
                    {addr.district} {addr.postalCode}
                </div>
                <div className="text-sm text-gray-600 font-bold">{addr.country}</div>
            </div>
        );
    };

    return (
        <div className="erp-card bg-white p-6 shadow-sm relative">
            <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Address Information</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage residential and permanent address details</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => manager.setActiveSubDrawer("edit_address")} className="h-8 border-brand-primary text-brand-primary">
                    <Edit className="w-3.5 h-3.5 mr-2" /> Edit Address
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="border border-emerald-100 rounded-lg p-5 bg-emerald-50/30">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Home className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Residential Address</h3>
                                <p className="text-xs text-gray-500">Current living address</p>
                            </div>
                        </div>
                        {(!residentialAddress.area) && <span className="text-[10px] font-bold tracking-widest text-gray-400">EMPTY</span>}
                    </div>
                    {renderAddress(residentialAddress)}
                </div>

                <div className="border border-indigo-100 rounded-lg p-5 bg-indigo-50/30">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Permanent Address</h3>
                                <p className="text-xs text-gray-500">Official registered address</p>
                            </div>
                        </div>
                        {(!permanentAddress.area) && <span className="text-[10px] font-bold tracking-widest text-gray-400">EMPTY</span>}
                    </div>
                    {renderAddress(permanentAddress)}
                </div>
            </div>

            <AddressEditDrawer manager={manager} />
        </div>
    );
}