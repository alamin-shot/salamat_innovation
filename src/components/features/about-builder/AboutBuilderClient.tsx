"use client";
import { useAboutBuilderManager } from "@/hooks/about_hooks/useAboutBuilderManager";
import { BuilderCanvas } from "./BuilderCanvas";
import { SettingsSidebar } from "./SettingsSidebar";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function AboutBuilderClient({ platform }: { platform: "salamat" | "tekzo" }) {
    const manager = useAboutBuilderManager(platform);

    return (
        <div className="flex flex-col w-full h-[calc(100vh-4rem)] gap-4 overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Section Builder</h1>
                    <p className="text-sm text-gray-500 capitalize">{platform} About Us · /about-us</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
                    Save
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
                {/* Left Pane: The recursive canvas */}
                <BuilderCanvas manager={manager} />

                {/* Right Pane: Contextual Settings */}
                <SettingsSidebar manager={manager} />
            </div>

            <ConfirmModal
                isOpen={manager.confirmModal.isOpen}
                title="Delete Block"
                message="Are you sure you want to delete this block and all of its contents? This cannot be undone."
                onConfirm={manager.confirmDeleteBlock}
                onCancel={manager.closeConfirm}
            />
        </div>
    );
}