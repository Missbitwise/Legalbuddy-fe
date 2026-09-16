"use client";

import { create } from "zustand";
import { conversationApi } from "@/lib/api/conversation.api";
import { aiApi } from "@/lib/api/ai.api";
import { Conversation, Message } from "@/types/conversation.types";

interface ConversationsState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoadingList: boolean;
  isLoadingChat: boolean;
  isSending: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
  fetchConversationById: (id: string) => Promise<void>;
  refreshActiveConversationSilently: (id: string) => Promise<void>;
  createNewConversation: (title?: string) => Promise<Conversation>;
  sendMessage: (content: string, conversationId?: string) => Promise<string>;
  editAndResendMessage: (messageId: string, content: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  clearActiveConversation: () => void;
  clearError: () => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isLoadingList: false,
  isLoadingChat: false,
  isSending: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoadingList: true, error: null });

    try {
      const res = await conversationApi.getAll();

      set({
        conversations: res.conversations,
        isLoadingList: false,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to load conversation history.",
        isLoadingList: false,
      });
    }
  },

  fetchConversationById: async (id: string) => {
    set({
      isLoadingChat: true,
      error: null,
    });

    try {
      const res = await conversationApi.getOne(id);

      set({
        activeConversation: res.conversation,
        isLoadingChat: false,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to load conversation details.",
        isLoadingChat: false,
      });
    }
  },

  createNewConversation: async (title?: string) => {
    set({ error: null });

    try {
      const res = await conversationApi.create({ title });

      const newConv = res.conversation;

      set((state) => ({
        conversations: [newConv, ...state.conversations],
        activeConversation: {
          ...newConv,
          messages: [],
        },
      }));

      return newConv;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to create conversation.";

      set({ error: msg });

      throw new Error(msg);
    }
  },

  sendMessage: async (
    content: string,
    targetConvId?: string
  ) => {
    const activeConv = get().activeConversation;

    const currentConvId =
      targetConvId || activeConv?.id;

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: currentConvId || "",
      role: "USER",
      content,
      createdAt: new Date().toISOString(),
    };

    // Immediately show the user's message
    if (activeConv) {
      set({
        activeConversation: {
          ...activeConv,
          messages: [
            ...(activeConv.messages || []),
            tempUserMsg,
          ],
        },
      });
    }

    // Only use isSending for the AI response
    set({
      isSending: true,
      error: null,
    });

    try {
      const aiResult = await aiApi.ask({
        question: content,
        conversationId: currentConvId,
      });

      const returnedConvId = aiResult.conversationId;
      const assistantText = aiResult.response.content;

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        conversationId: returnedConvId,
        role: "ASSISTANT",
        content: assistantText,
        createdAt: new Date().toISOString(),
      };

      // Update the active conversation locally.
      // Do NOT call fetchConversationById() here because
      // that would turn on isLoadingChat and cause the
      // conversation UI to blink.
      set((state) => {
        if (!state.activeConversation) {
          return state;
        }

        const currentMessages =
          state.activeConversation.messages || [];

        return {
          activeConversation: {
            ...state.activeConversation,
            id: returnedConvId,
            messages: [
              ...currentMessages.filter(
                (message) => message.id !== tempUserMsg.id
              ),
              {
                ...tempUserMsg,
                id: `user-${Date.now()}`,
                conversationId: returnedConvId,
              },
              aiMsg,
            ],
          },
        };
      });

      // Refresh only the sidebar conversation list.
      // This uses isLoadingList, NOT isLoadingChat,
      // so the chat window remains visible.
      await get().fetchConversations();

      set({
        isSending: false,
      });

      return returnedConvId;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Something went wrong while fetching the answer. Please try again.";

      set({
        isSending: false,
        error: errMsg,
      });

      // Remove the temporary user message if the request failed.
      if (activeConv) {
        set({
          activeConversation: {
            ...activeConv,
            messages: [
              ...(activeConv.messages || []).filter(
                (message) => message.id !== tempUserMsg.id
              ),
            ],
          },
        });
      }

      throw new Error(errMsg);
    }
  },

  editAndResendMessage: async (
    messageId: string,
    content: string
  ) => {
    const activeConv = get().activeConversation;

    if (!activeConv) return;

    // Keep messages before the edited message.
    const msgs = activeConv.messages || [];

    const targetIdx = msgs.findIndex(
      (m) => m.id === messageId
    );

    const retained =
      targetIdx !== -1
        ? msgs.slice(0, targetIdx)
        : [];

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConv.id,
      role: "USER",
      content,
      createdAt: new Date().toISOString(),
    };

    set({
      activeConversation: {
        ...activeConv,
        messages: [...retained, tempUserMsg],
      },
      isSending: true,
      error: null,
    });

    try {
      await conversationApi.editAndResend(
        activeConv.id,
        messageId,
        content
      );

      // Update sidebar only.
      get().fetchConversations();

      // Do not use fetchConversationById() here.
      // It would trigger isLoadingChat and cause
      // the chat UI to blink.
      await get().refreshActiveConversationSilently(
        activeConv.id
      );

      set({
        isSending: false,
      });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to edit and resend prompt. Please try again.";

      set({
        isSending: false,
        error: errMsg,
      });

      // Silently restore the authoritative conversation
      // without showing the full-screen history loader.
      await get().refreshActiveConversationSilently(
        activeConv.id
      );

      throw new Error(errMsg);
    }
  },

  deleteConversation: async (id: string) => {
    set({ error: null });

    try {
      await conversationApi.delete(id);

      set((state) => ({
        conversations: state.conversations.filter(
          (c) => c.id !== id
        ),

        activeConversation:
          state.activeConversation?.id === id
            ? null
            : state.activeConversation,
      }));
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to delete conversation.",
      });
    }
  },

  clearActiveConversation: () => {
    set({
      activeConversation: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },

  // Silent refresh helper.
  // It fetches the latest conversation from the backend
  // WITHOUT changing isLoadingChat.
  refreshActiveConversationSilently: async (id: string) => {
    try {
      const res = await conversationApi.getOne(id);

      set({
        activeConversation: res.conversation,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to refresh conversation.",
      });
    }
  },
}));