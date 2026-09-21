"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/lib/api/chat.api";
import { ChatMessage } from "@/types";
import { useAuthStore } from "@/store/auth-store";

/** useChat - quản lý toàn bộ trạng thái khung chat (danh sách tin nhắn +
 * gửi tin nhắn mới) - tách hẳn khỏi component UI để `ChatWidget` chỉ lo
 * việc hiển thị, không lẫn logic gọi API. `sessionId` giữ nguyên trong suốt
 * phiên trò chuyện để BOT nhớ được ngữ cảnh nhiều lượt chat (xem
 * `ConversationStoreService` bên backend). */
export function useChat() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "bot",
      content:
        "Xin chào! Em là trợ lý ảo của Tea Shop 🍵. Anh/chị cần tư vấn loại trà nào, hay muốn đặt hàng luôn ạ?",
      // Tin nhắn chào mừng luôn CỐ ĐỊNH, không cần mốc thời gian thật -
      // dùng 0 thay vì `Date.now()` để tránh gọi hàm "không thuần" ngay
      // trong lúc render (vi phạm quy tắc render phải thuần của React).
      createdAt: 0,
    },
  ]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: (message: string) =>
      chatApi.send({ message, sessionId }, !!user),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", content: data.reply, createdAt: Date.now() },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          content: "Xin lỗi, hiện BOT đang gặp sự cố. Vui lòng thử lại sau ạ!",
          createdAt: Date.now(),
        },
      ]);
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content, createdAt: Date.now() },
      ]);
      mutation.mutate(content);
    },
    [mutation],
  );

  return { messages, sendMessage, isSending: mutation.isPending };
}
