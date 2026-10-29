import * as React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { QueryProvider } from "@/providers/QueryProvider";

export default function AdminRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>
        <QueryProvider>
            {children}
        </QueryProvider>
    </AdminLayout>;
}