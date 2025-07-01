// types/index.ts
export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ApiResponse {
  success: boolean;
  answer: string;
  error?: string;
}
