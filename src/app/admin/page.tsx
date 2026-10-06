import * as React from "react";

export default function AdminDashboard() {
    return (
        <div className="flex h-full flex-col gap-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-brand-text">Dashboard Overview</h1>
                <p className="mt-2 text-brand-subtext">
                    Welcome to the Salamat Innovation Admin Panel. Select an option from the sidebar to manage your platform.
                </p>
            </div>

            {/* Placeholder for future analytic widgets */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {['Total Revenue', 'Active Users', 'Pending Orders'].map((stat, i) => (
                    <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-brand-subtext/10">
                        <h3 className="text-sm font-medium text-brand-subtext">{stat}</h3>
                        <p className="mt-2 text-3xl font-bold text-brand-text">---</p>
                    </div>
                ))}
            </div>
        </div>
    );
}