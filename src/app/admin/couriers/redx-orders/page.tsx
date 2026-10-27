"use client";
import { useCourierManager } from "@/hooks/courier_hooks/useCourierManager";
import { REDX_CONFIG } from "@/config/courier.config";
import { BaseCourierView } from "@/components/features/couriers/shared/BaseCourierView";

export default function RedxOrdersPage() {
    const manager = useCourierManager(REDX_CONFIG);
    return <BaseCourierView manager={manager} />;
}