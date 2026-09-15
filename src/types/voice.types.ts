export interface DictateResponse {
  text: string;
}

export interface VoiceConversationResult {
  audioBlob: Blob;
  conversationId: string | null;
}
