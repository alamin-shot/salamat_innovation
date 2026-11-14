import { AddPurchaseForm } from "./AddPurchaseForm";

export function AddPurchaseClient() {
    return (
        <div className="flex flex-col w-full p-4">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Create Purchase</h1>
            </div>

            <div className="w-full pb-12">
                <AddPurchaseForm />
            </div>
        </div>
    );
}