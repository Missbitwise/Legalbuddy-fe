export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string | null;
  category?: string | null;
  status: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface CreateConversationPayload {
  title?: string;
  category?: string;
}

export interface SendMessagePayload {
  content: string;
}
