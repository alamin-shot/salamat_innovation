import * as React from "react";
import Image from "next/image";
import { Bell, User } from "lucide-react";

interface AdminHeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export function AdminHeader({ toggleSidebar, isSidebarOpen }: AdminHeaderProps) {
    return (
        <header className="relative z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-brand-subtext/20 bg-white px-4 shadow-sm">

            {/* Left Side: Mobile Hamburger & Brand */}
            <div className="flex items-center gap-3 lg:hidden">
                <button
                    onClick={toggleSidebar}
                    className="group relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg bg-brand-bg transition-colors hover:bg-brand-subtext/10"
                    aria-label="Toggle Sidebar"
                >
                    <span className={`block h-[2px] w-5 rounded-full bg-brand-text transition-all duration-300 ease-out ${isSidebarOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                    <span className={`block h-[2px] w-5 rounded-full bg-brand-text transition-all duration-300 ease-out ${isSidebarOpen ? "opacity-0 translate-x-2" : ""}`} />
                    <span className={`block h-[2px] w-5 rounded-full bg-brand-text transition-all duration-300 ease-out ${isSidebarOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
                </button>

                <div className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Salamat Logo" width={28} height={28} />
                    <span className="font-bold text-brand-text">Salamat</span>
                </div>
            </div>

            {/* Desktop Spacer (keeps right side aligned when left side is hidden) */}
            <div className="hidden lg:block flex-1" />

            {/* Right Side: Utilities & Profile */}
            <div className="ml-auto flex items-center gap-2 md:gap-4">

                {/* Notification Bell with Unread Indicator */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg text-brand-subtext transition-colors hover:bg-brand-subtext/20 hover:text-brand-text">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-brand-subtext/20 mx-1 md:mx-2" />

                {/* User Profile Info (Prepared for RBAC integration) */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden text-right md:block">
                        <p className="text-sm font-semibold leading-none text-brand-text transition-colors group-hover:text-brand-primary">
                            Admin User
                        </p>
                        <p className="mt-1 text-xs text-brand-subtext">
                            Super Admin
                        </p>
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary/20">
                        <User className="h-5 w-5" />
                    </button>
                </div>

            </div>
        </header>
    );
}