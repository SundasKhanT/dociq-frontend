import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expires, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const getMe = () => api.get("/auth/me");

// Documents
export const uploadDocuments = (files: File[]) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return api.post("/documents/upload", form);
};

export const listDocuments = () => api.get("/documents/");

export const getDocumentStatus = (id: string) =>
  api.get(`/documents/${id}/status`);

export const deleteDocument = (id: string) => api.delete(`/documents/${id}`);

// Chat
export const askQuestion = (
  question: string,
  sessionId?: string,
  documentIds?: string[],
) =>
  api.post("/chat/ask", {
    question,
    session_id: sessionId,
    document_ids: documentIds,
  });

export const listSessions = () => api.get("/chat/sessions");

export const getMessages = (sessionId: string) =>
  api.get(`/chat/sessions/${sessionId}/messages`);

export const deleteSession = (sessionId: string) =>
  api.delete(`/chat/sessions/${sessionId}`);

export default api;
