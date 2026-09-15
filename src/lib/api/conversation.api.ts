import { apiClient } from "./client";
import {
  Conversation,
  CreateConversationPayload,
  Message,
  SendMessagePayload,
} from "@/types/conversation.types";

export const conversationApi = {
  async create(payload?: CreateConversationPayload): Promise<{ conversation: Conversation }> {
    const { data } = await apiClient.post<{ conversation: Conversation }>(
      "/conversations",
      payload || {}
    );
    return data;
  },

  async getAll(): Promise<{ conversations: Conversation[] }> {
    const { data } = await apiClient.get<{ conversations: Conversation[] }>(
      "/conversations"
    );
    return data;
  },

  async getOne(id: string): Promise<{ conversation: Conversation }> {
    const { data } = await apiClient.get<{ conversation: Conversation }>(
      `/conversations/${id}`
    );
    return data;
  },

  async sendMessage(
    conversationId: string,
    payload: SendMessagePayload
  ): Promise<{ message: Message }> {
    const { data } = await apiClient.post<{ message: Message }>(
      `/conversations/${conversationId}/messages`,
      payload
    );
    return data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/conversations/${id}`
    );
    return data;
  },

  async editAndResend(
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<{ conversationId: string; response: { content: string } }> {
    const { data } = await apiClient.put<{ conversationId: string; response: { content: string } }>(
      `/conversations/${conversationId}/messages/${messageId}`,
      { content }
    );
    return data;
  },
};
