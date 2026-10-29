"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatUIStore } from "@/store/useChatUIStore";
import { Conversation, ChatMessage } from "@/types/chat.types";
import { toast } from "sonner";

const fetchConversations = async (): Promise<Conversation[]> => {
    return [];
};

const fetchMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    return [];
};

const sendMessageAPI = async (payload: { conversationId: string, text: string }) => {
    return true;
};

export function useChatEngine(currentUserId: string) {
    const queryClient = useQueryClient();
    const { activeTab, activeConversationId } = useChatUIStore();

    // 1. Fetch & Cache Conversations
    const { data: conversations = [], isLoading: isLoadingChats } = useQuery({
        queryKey: ["chat", "conversations"],
        queryFn: fetchConversations,
        refetchInterval: false,
    });


    const filteredConversations = conversations.filter(conv => {
        if (activeTab === "all") return conv.status === "Open";
        if (activeTab === "unassigned") return conv.status === "Open" && conv.assigneeId === null;
        if (activeTab === "mine") return conv.status === "Open" && conv.assigneeId === currentUserId;
        if (activeTab === "closed") return conv.status === "Closed";
        return true;
    });


    const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
        queryKey: ["chat", "messages", activeConversationId],
        queryFn: () => fetchMessages(activeConversationId!),
        enabled: !!activeConversationId,
    });


    const sendMessage = useMutation({
        mutationFn: sendMessageAPI,
        onMutate: async (newMsg) => {
            // Cancel outgoing refetches to prevent overwriting our optimistic update
            await queryClient.cancelQueries({ queryKey: ["chat", "messages", newMsg.conversationId] });

            // CORRECTED LINE:
            const previousMessages = queryClient.getQueryData(["chat", "messages", newMsg.conversationId]);

            // Optimistically update the UI instantly
            const optimisticMessage: ChatMessage = {
                id: `temp-${Date.now()}`,
                conversationId: newMsg.conversationId,
                senderId: currentUserId,
                text: newMsg.text,
                timestamp: new Date().toISOString(),
                status: "sending"
            };

            queryClient.setQueryData(["chat", "messages", newMsg.conversationId], (old: ChatMessage[] = []) => [
                ...old,
                optimisticMessage
            ]);

            return { previousMessages };
        },
        onError: (err, newMsg, context) => {
            queryClient.setQueryData(["chat", "messages", newMsg.conversationId], context?.previousMessages);
            toast.error("Failed to send message. Please try again.");
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ["chat", "messages", variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
        }
    });

    return {
        filteredConversations,
        messages,
        isLoadingChats,
        isLoadingMessages,
        sendMessage,
    };
}