export type ChatPlatform = "Instagram" | "Messenger" | "WhatsApp";
export type ChatStatus = "Open" | "Closed";
export type ChatTab = "all" | "unassigned" | "mine" | "closed";
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "error";

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string; // "system", "agent-{id}", or "customer"
    text: string;
    timestamp: string;
    status: MessageStatus;
}

export interface Conversation {
    id: string;
    externalId: string; // e.g., 2212588116272574
    platform: ChatPlatform;
    customerName: string;
    assigneeId: string | null; // null = Unassigned
    status: ChatStatus;
    priority: "High" | "Medium" | "Low" | "None";
    unreadCount: number;
    lastMessageAt: string;
    lastMessagePreview: string;
}