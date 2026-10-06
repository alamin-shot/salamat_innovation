"use client";
import * as React from "react";
import { AdminSidebar } from "./sidebar/AdminSidebar";
import { AdminHeader } from "./header/AdminHeader";
import { useSidebarLayout } from "@/hooks/useSidebarLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isMobileOpen, toggleSidebar, closeSidebar } = useSidebarLayout();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-brand-bg relative">
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-brand-text/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* The Responsive Sidebar */}
            <AdminSidebar isOpen={isMobileOpen} />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden w-full transition-all duration-300">
                <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isMobileOpen} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}