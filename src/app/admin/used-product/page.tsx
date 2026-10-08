import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UsedProductsClientManager } from "@/components/features/used-products/UsedProductsClientManager";

export default function UsedProductsPage() {
    return (
        <UsedProductsClientManager />
    );
}