"use client";
import { ChatClient } from "@/components/features/chat/ChatClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function ChatPage() {
    const currentUserId = "agent-1";

    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <div className="w-full h-full flex flex-col">
                <ChatClient currentUserId={currentUserId} />
            </div>
        </Suspense>
    );
}

