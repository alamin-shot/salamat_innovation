import { create } from "zustand";

interface ChatUIState {
    activeTab: import("@/types/chat.types").ChatTab;
    activeConversationId: string | null;
    isInfoPanelOpen: boolean;
    draftMessages: Record<string, string>; // Maps conversationId -> draft text

    // Actions
    setActiveTab: (tab: import("@/types/chat.types").ChatTab) => void;
    setActiveConversation: (id: string | null) => void;
    toggleInfoPanel: () => void;
    setDraft: (conversationId: string, text: string) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
    activeTab: "all",
    activeConversationId: null,
    isInfoPanelOpen: true, // Default open per screenshot 20
    draftMessages: {},

    setActiveTab: (tab) => set({ activeTab: tab, activeConversationId: null }), // Reset selection on tab switch
    setActiveConversation: (id) => set({ activeConversationId: id }),
    toggleInfoPanel: () => set((state) => ({ isInfoPanelOpen: !state.isInfoPanelOpen })),
    setDraft: (id, text) => set((state) => ({
        draftMessages: { ...state.draftMessages, [id]: text }
    }))
}));