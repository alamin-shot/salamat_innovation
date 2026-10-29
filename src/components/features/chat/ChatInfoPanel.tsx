"use client";
import { useChatUIStore } from "@/store/useChatUIStore";
import { useChatEngine } from "@/hooks/chat_hooks/useChatEngine";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";

// Dummy data for dropdowns
const AGENT_OPTIONS = ["Unassigned", "Jannat Ul Naeem Sarah", "Md Zihadul Islam Sazzad"];
const PRIORITY_OPTIONS = ["None", "Low", "Medium", "High"];

export function ChatInfoPanel() {
    const { activeConversationId } = useChatUIStore();
    // Assuming a generic store access for demo; in reality pass currentUserId properly
    const { filteredConversations } = useChatEngine("agent-1");

    const activeConv = filteredConversations.find(c => c.id === activeConversationId);

    if (!activeConv) return null;

    return (
        <div className="w-80 border-l border-gray-200 bg-white shrink-0 h-full overflow-y-auto p-6 custom-scrollbar">
            {/* Customer Profile Summary */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                <div className="h-16 w-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-sm">
                    {activeConv.platform === "Instagram" ? "I#" : "M#"}
                </div>
                <h3 className="font-bold text-gray-900">{activeConv.customerName}</h3>
                <p className="text-xs text-amber-600 font-medium mt-1 mb-4">Not saved to Contacts yet.</p>
                <Button variant="success" className="w-full h-9">+ Add to Contacts</Button>
            </div>

            {/* Conversation Actions Block */}
            <div className="py-6 border-b border-gray-100 flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversation Actions</h4>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Assigned Agent</label>
                    <CustomSelect
                        value={activeConv.assigneeId ? "Jannat Ul Naeem Sarah" : "Unassigned"}
                        options={AGENT_OPTIONS}
                        onChange={() => { }}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Priority</label>
                    <CustomSelect
                        value={activeConv.priority}
                        options={PRIORITY_OPTIONS}
                        onChange={() => { }}
                    />
                </div>
            </div>

            {/* Information Block */}
            <div className="py-6 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversation Information</h4>

                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                    <span className="text-gray-500">Channel</span>
                    <span className="text-gray-900 font-medium text-right">{activeConv.platform}</span>

                    <span className="text-gray-500">External ID</span>
                    <span className="text-gray-900 font-medium text-right">{activeConv.externalId}</span>

                    <span className="text-gray-500">Created At</span>
                    <span className="text-gray-900 font-medium text-right text-xs">2026-10-27 09:35:40</span>
                </div>
            </div>
        </div>
    );
}