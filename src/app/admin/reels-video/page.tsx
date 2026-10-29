
import { ReelsClient } from "@/components/features/reels/ReelsClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function ReelsViPageels() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            < ReelsClient />;

        </Suspense>
    )
}