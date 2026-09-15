"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversationsStore } from "@/hooks/useConversations";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatComposer } from "@/components/chat/ChatComposer";

export default function NewChatPage() {
  const router = useRouter();
  const {
    activeConversation,
    isSending,
    sendMessage,
    editAndResendMessage,
    clearActiveConversation,
  } = useConversationsStore();

  useEffect(() => {
    clearActiveConversation();
  }, [clearActiveConversation]);

  const handleSend = async (text: string) => {
    try {
      const convId = await sendMessage(text);
      if (convId) {
        router.push(`/app/chat/${convId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatWindow
        messages={activeConversation?.messages || []}
        isSending={isSending}
        onSelectPrompt={handleSend}
        onEditAndResend={editAndResendMessage}
      />
      <ChatComposer onSend={handleSend} isSending={isSending} />
    </div>
  );
}
