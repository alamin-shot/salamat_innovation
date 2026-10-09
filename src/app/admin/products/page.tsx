import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductsClientManager } from "@/components/features/products/ProductsClientManager";
import { Loader } from "@/components/shared/loader/Loader";


export default function ProductsPage() {
    return (
        <PageContainer
            title="Products"
            breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Products" }]}
            action={
                <Link
                    href="?drawer=add-product"
                    scroll={false}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 hover:shadow-md"
                >
                    <Plus className="h-4 w-4" /> Add Product
                </Link>
            }
        >
            <React.Suspense fallback={
                <div>
                    <Loader />
                </div>
            }>
                <ProductsClientManager />
            </React.Suspense>
        </PageContainer>
    );
}