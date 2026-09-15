import { apiClient } from "./client";
import { LegalDocument, UploadDocumentPayload } from "@/types/legal.types";

export const legalApi = {
  async uploadDocument(payload: UploadDocumentPayload): Promise<{ document: LegalDocument }> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("title", payload.title);
    formData.append("category", payload.category);
    if (payload.version) {
      formData.append("version", payload.version);
    }
    if (payload.sourceUrl) {
      formData.append("sourceUrl", payload.sourceUrl);
    }

    const { data } = await apiClient.post<{ document: LegalDocument }>(
      "/legal/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },
};
