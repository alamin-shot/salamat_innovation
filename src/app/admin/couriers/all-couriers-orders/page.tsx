"use client";
import { useCourierManager } from "@/hooks/courier_hooks/useCourierManager";
import { ALL_COURIERS_CONFIG } from "@/config/courier.config";
import { BaseCourierView } from "@/components/features/couriers/shared/BaseCourierView";

export default function AllCouriersPage() {
    const manager = useCourierManager(ALL_COURIERS_CONFIG);
    return <BaseCourierView manager={manager} />;
}