import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useApplicationFormManager } from "@/hooks/partner_hooks/application_hooks/useApplicationFormManager";
import { Application } from "@/hooks/partner_hooks/application_hooks/useApplicationStore";

export function ApplicationFormDrawer({
    initialRecord,
    isOpen,
    onClose,
}: {
    initialRecord: Application | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useApplicationFormManager(initialRecord, onClose);
    const isEdit = Boolean(initialRecord);

    if (!isOpen) return null;

    return (
        <Drawer title={isEdit ? "Update Application" : "Add Application"} isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-3xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Name <span className="text-red-500">*</span></label>
                            <input type="text" value={manager.name} onChange={(e) => manager.setName(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Email</label>
                            <input type="email" value={manager.email} onChange={(e) => manager.setEmail(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Phone <span className="text-red-500">*</span></label>
                            <input type="text" value={manager.phone} onChange={(e) => manager.setPhone(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-9" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Status <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={manager.status}
                                onChange={manager.setStatus}
                                options={["Pending", "Approved", "Rejected"]}
                                placeholder="Select Status"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-gray-600">Address</label>
                        <textarea
                            rows={3}
                            value={manager.address}
                            onChange={(e) => manager.setAddress(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-white p-3 text-[13px] focus:border-emerald-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="px-6 h-9 font-medium text-gray-600">Cancel</Button>
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">Save</Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}