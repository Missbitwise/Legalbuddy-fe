import { apiClient } from "./client";
import { AskAIRequest, AskAIResponse } from "@/types/ai.types";

export const aiApi = {
  async ask(payload: AskAIRequest): Promise<AskAIResponse> {
    const { data } = await apiClient.post<AskAIResponse>("/ai/ask", payload);
    return data;
  },
};
