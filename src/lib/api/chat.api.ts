import { apiClient } from "./axios-client";
import { ChatApiRequest, ChatApiResponse } from "@/types";

/** chatApi - gọi BOT tư vấn bán trà, khớp `BotController`.
 * `send()` tự chọn đúng endpoint: có đăng nhập -> `/bot/chat/me` (BOT có
 * quyền đặt hàng thật), chưa đăng nhập -> `/bot/chat` (chỉ tư vấn). */
export const chatApi = {
  send: (payload: ChatApiRequest, isAuthenticated: boolean) =>
    apiClient
      .post<ChatApiResponse>(isAuthenticated ? "/bot/chat/me" : "/bot/chat", payload)
      .then((r) => r.data),
};
