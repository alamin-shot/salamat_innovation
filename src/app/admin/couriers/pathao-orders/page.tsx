"use client";
import { useCourierManager } from "@/hooks/courier_hooks/useCourierManager";
import { PATHAO_CONFIG } from "@/config/courier.config";
import { BaseCourierView } from "@/components/features/couriers/shared/BaseCourierView";

export default function PathaoOrdersPage() {
    const manager = useCourierManager(PATHAO_CONFIG);
    return <BaseCourierView manager={manager} />;
}