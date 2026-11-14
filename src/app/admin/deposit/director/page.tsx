import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { DirectorSectionClient } from "@/components/features/directors-module/section/DirectorSectionClient";

export default function DepositDirectorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DirectorSectionClient kind="deposit" />
        </Suspense>
    );
}
