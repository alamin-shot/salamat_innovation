"use client";
import * as React from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UpdateSellerModalProps {
    isOpen: boolean;
    onClose: () => void;
    saleId?: string | null;
    onSave: (saleId: string, sellerName: string) => void;
}

export function UpdateSellerModal({ isOpen, onClose, saleId, onSave }: UpdateSellerModalProps) {
    const [selectedSeller, setSelectedSeller] = React.useState("");
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        if (saleId && selectedSeller) {
            onSave(saleId, selectedSeller);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-[15px] font-semibold text-gray-800">Seller</h2>
                    <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-600">Seller</label>
                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex w-full items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none">
                                <span>{selectedSeller || "Choose a Seller"}</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg z-10 py-2">
                                    <div className="px-3 pb-2 mb-1 border-b border-gray-100">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                                            <input type="text" placeholder="Search" className="w-full rounded bg-gray-50 py-1.5 pl-8 pr-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto">
                                        {["AV", "Alamin Rifat", "Md Siyam Hosen", "Taslima Islam Nishi", "Atick Hasan", "Fidel"].map(name => (
                                            <button key={name} onClick={() => { setSelectedSeller(name); setIsDropdownOpen(false); }} className="w-full px-4 py-1.5 text-left text-[13px] text-gray-700 hover:bg-gray-50">
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 mt-24">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="success" onClick={handleSave} disabled={!selectedSeller}>Save</Button>
                </div>
            </div>
        </div>
    );
}