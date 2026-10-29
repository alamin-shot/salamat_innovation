"use client";
import { useChatUIStore } from "@/store/useChatUIStore";
import { ChatListSidebar } from "./ChatListSidebar";
import { ChatWindow } from "./ChatWindow";
import { ChatInfoPanel } from "./ChatInfoPanel";

export function ChatClient({ currentUserId }: { currentUserId: string }) {
    const isInfoPanelOpen = useChatUIStore(state => state.isInfoPanelOpen);

    return (
        // Enforces a fixed height relative to the viewport so internal panes can scroll independently
        <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-white border-t border-gray-200">

            {/* Pane 1: Thread List */}
            <ChatListSidebar currentUserId={currentUserId} />

            {/* Pane 2: Message Window */}
            <ChatWindow currentUserId={currentUserId} />

            {/* Pane 3: Info & Assignment Panel */}
            {isInfoPanelOpen && (
                <ChatInfoPanel />
            )}

        </div>
    );
}