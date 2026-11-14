import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { DirectorSectionClient } from "@/components/features/directors-module/section/DirectorSectionClient";

export default function WithdrawalDirectorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DirectorSectionClient kind="withdrawal" />
        </Suspense>
    );
}
