"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useSaleReturnForm } from "@/hooks/sales_hooks/useSaleReturnForm";
import { SALE_RETURN_LIST_PATH } from "@/constants/sales";
import { SaleReturnEditor } from "../return-editor/SaleReturnEditor";

/** Add Sale Return: customer auto-filled from the original sale and locked; saves for real. */
export function AddSaleReturnForm() {
    const router = useRouter();
    const form = useSaleReturnForm(null, () => router.push(SALE_RETURN_LIST_PATH));
    return <SaleReturnEditor form={form} />;
}
