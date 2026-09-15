"use client";

import React, { useEffect, use } from "react";
import { useConversationsStore } from "@/hooks/useConversations";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { Spinner } from "@/components/ui/Spinner";
import { AlertCircle } from "lucide-react";

export default function ActiveChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.conversationId;

  const {
    activeConversation,
    isLoadingChat,
    isSending,
    error,
    fetchConversationById,
    sendMessage,
    editAndResendMessage,
  } = useConversationsStore();

  useEffect(() => {
    if (conversationId) {
      fetchConversationById(conversationId);
    }
  }, [conversationId, fetchConversationById]);

  const handleSend = async (text: string) => {
    await sendMessage(text, conversationId);
  };

  if (isLoadingChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" className="text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading legal conversation history...</p>
      </div>
    );
  }

  if (error && !activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 max-w-md space-y-2 border border-red-500/20">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <h3 className="font-semibold text-sm">Conversation Error</h3>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatWindow
        messages={activeConversation?.messages || []}
        isSending={isSending}
        onEditAndResend={editAndResendMessage}
      />
      <ChatComposer onSend={handleSend} isSending={isSending} />
    </div>
  );
}
