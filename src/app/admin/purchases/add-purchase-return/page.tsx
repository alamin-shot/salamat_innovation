import { AddPurchaseReturnForm } from "@/components/features/purchases/add-purchase-return/AddPurchaseReturnForm";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddPurchaseReturnPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddPurchaseReturnForm />;

        </Suspense>
    )
}