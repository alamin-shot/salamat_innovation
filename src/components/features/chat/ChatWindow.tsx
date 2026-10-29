"use client";
import { useState } from "react";
import { useChatUIStore } from "@/store/useChatUIStore";
import { useChatEngine } from "@/hooks/chat_hooks/useChatEngine";
import { Info, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ChatWindow({ currentUserId }: { currentUserId: string }) {
    const { activeConversationId, toggleInfoPanel, draftMessages, setDraft } = useChatUIStore();
    const { filteredConversations, messages, sendMessage } = useChatEngine(currentUserId);

    // Find the active conversation metadata
    const activeConv = filteredConversations.find(c => c.id === activeConversationId);

    // Local input state initialized from the Zustand draft store
    const [inputText, setInputText] = useState(activeConversationId ? draftMessages[activeConversationId] || "" : "");

    if (!activeConversationId || !activeConv) {
        return (
            <div className="flex-1 bg-white flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
            </div>
        );
    }

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage.mutate({ conversationId: activeConversationId, text: inputText });
        setInputText("");
        setDraft(activeConversationId, "");
    };

    return (
        <div className="flex-1 flex flex-col bg-white min-w-0">
            {/* Header with Ghost Action Buttons */}
            <div className="h-[72px] shrink-0 border-b border-gray-200 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                        {activeConv.platform === "Instagram" ? "I#" : "M#"}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{activeConv.customerName}</h3>
                        <p className="text-xs text-gray-500">{activeConv.externalId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 mr-2">
                        {activeConv.assigneeId ? "Assigned" : "Unassigned"}
                    </span>
                    {!activeConv.assigneeId && (
                        <Button variant="outline" size="sm" className="h-8">Claim</Button>
                    )}
                    <Button variant="ghost" size="icon-sm" onClick={toggleInfoPanel} className="text-gray-500 hover:text-emerald-600">
                        <Info className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Virtualized Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 flex flex-col gap-4 custom-scrollbar">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                            <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe ? "bg-emerald-600 text-white rounded-br-none" : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 flex gap-2">
                                {msg.timestamp}
                                {isMe && <span className="font-medium capitalize">{msg.status}</span>}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Conditional Input / Assignment Banner Engine */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0 min-h-[80px] flex flex-col justify-center">
                {activeConv.assigneeId === currentUserId ? (
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="erp-input flex-1"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setDraft(activeConversationId, e.target.value);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <Button variant="success" className="px-6 gap-2" onClick={handleSend}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="bg-amber-100 text-amber-800 text-sm font-medium py-3 px-4 rounded-md text-center border border-amber-200 shadow-sm">
                        You must be assigned to this conversation to reply.
                    </div>
                )}
            </div>
        </div>
    );
}