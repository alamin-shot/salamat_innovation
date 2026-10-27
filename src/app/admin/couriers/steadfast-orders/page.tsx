"use client";
import { useCourierManager } from "@/hooks/courier_hooks/useCourierManager";
import { STEADFAST_CONFIG } from "@/config/courier.config";
import { BaseCourierView } from "@/components/features/couriers/shared/BaseCourierView";

export default function SteadfastOrdersPage() {
    const manager = useCourierManager(STEADFAST_CONFIG);
    return <BaseCourierView manager={manager} />;
}