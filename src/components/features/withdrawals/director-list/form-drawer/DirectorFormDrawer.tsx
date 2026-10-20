import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useDirectorFormManager } from "@/hooks/finance_hooks/withdrawal_hooks/useDirectorFormManager";
import { Director } from "@/hooks/finance_hooks/withdrawal_hooks/useDirectorStore";

export function DirectorFormDrawer({
    initialRecord,
    isOpen,
    onClose,
}: {
    initialRecord: Director | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const manager = useDirectorFormManager(initialRecord, onClose);

    if (!isOpen) return null;

    return (
        <Drawer title="Edit Director" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Warehouse or Store Name <span className="text-red-500">*</span></label>
                            <CustomSelect value={manager.shop} onChange={manager.setShop} options={["TEKZO A-Block", "TEKZO B-Block"]} placeholder="Choose a Shop" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-gray-600">Directors <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={manager.name}
                                onChange={(e) => manager.setName(e.target.value)}
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-10"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-gray-100 mt-4">
                        <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">Submit</Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}