import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { CouponClient } from "@/components/features/coupon/CouponClient";

export const metadata = {
    title: "Coupons | Salamat Innovation ERP",
};

export default function CouponPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <CouponClient />
        </Suspense>
    );
}