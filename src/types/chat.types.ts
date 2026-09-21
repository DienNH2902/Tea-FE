/**
 * ============================================================================
 *  CHAT TYPES - khớp `ChatRequestDto`/`ChatResponseDto` module bot backend
 * ============================================================================
 */

export interface ChatApiRequest {
  message: string;
  sessionId?: string;
}

/** Response trả về từ POST /bot/chat hoặc /bot/chat/me */
export interface ChatApiResponse {
  sessionId: string;
  reply: string;
  toolsUsed: string[];
}

/** 1 tin nhắn hiển thị trong khung chat (khác với ChatApiRequest/Response -
 * đây là model cho UI, có thêm role + thời điểm gửi để render bong bóng chat) */
export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt: number;
}
