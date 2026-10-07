import { FormInput } from "@/components/ui/forms/FormInput";

export function SpecificationsForm({ productId }: { productId: string | null }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-brand-subtext/20 bg-brand-bg/10 p-5">
                <p className="text-sm text-brand-subtext">Mapping specifications for Product ID: {productId}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Display Size" placeholder="e.g. 6.5 inches" />
                <FormInput label="Processor" placeholder="e.g. Snapdragon 8 Gen 2" />
                <FormInput label="RAM" placeholder="e.g. 8GB" />
                <FormInput label="Battery" placeholder="e.g. 5000 mAh" />
            </div>
            <div className="flex justify-end mt-4">
                <button className="rounded-md bg-brand-primary px-6 py-2 text-sm font-semibold text-white">Save Specs</button>
            </div>
        </div>
    );
}