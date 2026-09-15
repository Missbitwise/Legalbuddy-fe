import { apiClient } from "./client";
import { DictateResponse, VoiceConversationResult } from "@/types/voice.types";

export const voiceApi = {
  /**
   * Mode 1: Dictation
   * Transcribe recorded audio file to text
   */
  async dictate(audioBlob: Blob): Promise<DictateResponse> {
    const formData = new FormData();
    const file = new File([audioBlob], "speech.webm", {
      type: audioBlob.type || "audio/webm",
    });
    formData.append("audio", file);

    const { data } = await apiClient.post<DictateResponse>(
      "/voice/dictate",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  /**
   * Mode 2: Real-time Voice Conversation
   * Sends audio to RAG backend, receives audio response blob + X-Conversation-Id header
   */
  async voiceConversation(
    audioBlob: Blob,
    conversationId?: string
  ): Promise<VoiceConversationResult> {
    const formData = new FormData();
    const file = new File([audioBlob], "speech.webm", {
      type: audioBlob.type || "audio/webm",
    });
    formData.append("audio", file);

    if (conversationId) {
      formData.append("conversationId", conversationId);
    }

    const response = await apiClient.post("/voice/conversation", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });

    const returnedConvId =
      response.headers["x-conversation-id"] ||
      response.headers["X-Conversation-Id"] ||
      null;

    return {
      audioBlob: response.data as Blob,
      conversationId: returnedConvId,
    };
  },
};
