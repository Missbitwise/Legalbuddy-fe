import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL,
  timeout: 180000, // 3 minutes for long voice transcription + RAG + TTS operations
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Auth Bearer Token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("legalbuddy_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors — including blob responses where the server
// sent a JSON error body (e.g. 500 from voice endpoint with responseType:'blob')
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("legalbuddy_token");
      }
    }

    // If the error body is a Blob (happens when responseType:'blob' + server error),
    // parse it back to JSON so the error message is readable
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        error.response.data = parsed;
        error.message = parsed?.message || error.message;
      } catch {
        // not JSON, leave as-is
      }
    }

    return Promise.reject(error);
  }
);
