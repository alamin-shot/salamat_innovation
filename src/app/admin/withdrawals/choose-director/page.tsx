import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { ChooseDirectorClient } from "@/components/features/directors-module/section/ChooseDirectorClient";

export default function WithdrawalChooseDirectorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ChooseDirectorClient kind="withdrawal" />
        </Suspense>
    );
}
