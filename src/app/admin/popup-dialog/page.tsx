import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { PopupDialogClient } from "@/components/features/popup-dialog/PopupDialogClient";

export const metadata = {
    title: "Popup Dialog | Salamat Innovation ERP",
};

export default function PopupDialogPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <PopupDialogClient />
        </Suspense>
    );
}