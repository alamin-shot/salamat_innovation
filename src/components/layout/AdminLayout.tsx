import * as React from "react";
import { AdminSidebar } from "./sidebar/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-bg flex justify-center w-full">
            <div className="w-full min-w-[320px] max-w-[1920px] flex overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}