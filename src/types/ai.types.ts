export interface AskAIRequest {
  question: string;
  conversationId?: string;
}

export interface AskAIResponse {
  conversationId: string;
  response: {
    content: string;
    [key: string]: any;
  };
}
