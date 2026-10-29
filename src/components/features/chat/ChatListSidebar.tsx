"use client";
import { useRef } from "react";
import { Search } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useChatUIStore } from "@/store/useChatUIStore";
import { useChatEngine } from "@/hooks/chat_hooks/useChatEngine";
import { ChatTab } from "@/types/chat.types";

const TABS: { id: ChatTab, label: string }[] = [
    { id: "all", label: "All" },
    { id: "unassigned", label: "Unassigned" },
    { id: "mine", label: "Mine" },
    { id: "closed", label: "Closed" }
];

export function ChatListSidebar({ currentUserId }: { currentUserId: string }) {
    const { activeTab, setActiveTab, activeConversationId, setActiveConversation } = useChatUIStore();
    const { filteredConversations } = useChatEngine(currentUserId);

    // Virtualizer setup for massive thread lists
    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: filteredConversations.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, // Estimated pixel height of one conversation card
        overscan: 5,
    });

    return (
        <div className="w-80 sm:w-96 flex flex-col border-r border-gray-200 bg-gray-50/50 shrink-0 h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search" className="erp-input pl-9 w-full bg-white" />
                </div>
            </div>

            {/* Filtering Tabs */}
            <div className="flex px-2 border-b border-gray-200">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-emerald-600 text-emerald-700"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Virtualized List Container */}
            <div ref={parentRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const conv = filteredConversations[virtualRow.index];
                        const isActive = activeConversationId === conv.id;

                        return (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-100 transition-colors ${isActive ? "bg-emerald-50/50" : "hover:bg-gray-100/50"
                                    }`}
                            >
                                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                                    {conv.platform === "Instagram" ? "I#" : "M#"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">{conv.customerName}</h4>
                                        <span className="text-[10px] text-gray-500">{conv.lastMessageAt}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">{conv.lastMessagePreview}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{conv.platform}</span>
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{conv.status}</span>
                                        {!conv.assigneeId && <span className="text-[10px] text-gray-500 ml-auto">Unassigned</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}