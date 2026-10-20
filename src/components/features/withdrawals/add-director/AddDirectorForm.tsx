import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";

export function AddDirectorForm({ manager }: { manager: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">
                    Warehouse or Store Name <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                    value={manager.shop}
                    onChange={manager.setShop}
                    options={["TEKZO A-Block", "TEKZO B-Block"]}
                    placeholder="Choose a Shop"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">
                    Directors <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Choose a Director or Enter Name"
                    value={manager.name}
                    onChange={(e) => manager.setName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none h-10"
                />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end pt-4 border-t border-gray-100">
                <Button type="button" variant="success" onClick={manager.handleSave} className="px-8 h-9 font-medium">
                    Submit
                </Button>
            </div>
        </div>
    );
}