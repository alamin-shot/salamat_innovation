import { PeopleClient } from "@/components/features/people/PeopleClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function PeoplePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <PeopleClient />
        </Suspense>
    )
}