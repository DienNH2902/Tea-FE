"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";
import { useUiStore } from "@/store/ui-store";
import { ChatMessageBubble } from "./chat-message-bubble";
import { chatMessageSchema } from "@/lib/validations/chat.schema";

/**
 * ChatWidget - khung chat NỔI (floating bubble) ở góc dưới-phải màn hình,
 * hiển thị TOÀN CỤC (gắn 1 lần ở `(main)/layout.tsx`) để khách có thể trò
 * chuyện với BOT tư vấn ở BẤT KỲ trang nào mà không rời khỏi trang đang xem.
 * Trạng thái đóng/mở được lưu ở `ui-store` để Sidebar cũng có thể mở nó
 * (mục "Trò chuyện với BOT").
 */
export function ChatWidget() {
  const isOpen = useUiStore((s) => s.chatWidgetOpen);
  const setOpen = useUiStore((s) => s.setChatWidgetOpen);
  const { messages, sendMessage, isSending } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự cuộn xuống tin nhắn mới nhất mỗi khi có tin nhắn/panel vừa mở
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = chatMessageSchema.safeParse({ message: input });
    if (!parsed.success) return;
    sendMessage(parsed.data.message);
    setInput("");
  }

  return (
    <>
      {/* Nút bong bóng - luôn nổi ở góc màn hình */}
      {!isOpen && (
        <Button
          size="icon"
          className="fixed right-5 bottom-5 z-50 size-14 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="Mở khung chat với BOT tư vấn"
        >
          <MessageCircle className="size-6" />
        </Button>
      )}

      {isOpen && (
        <div className="bg-card fixed right-5 bottom-5 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl">
          <div className="bg-primary text-primary-foreground flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-semibold">Trợ lý Tea Shop</p>
              <p className="text-xs opacity-80">Tư vấn &amp; đặt hàng tự động</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => setOpen(false)}
              aria-label="Đóng khung chat"
            >
              <X className="size-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-3">
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <ChatMessageBubble key={m.id} message={m} />
              ))}
              {isSending && (
                <p className="text-muted-foreground pl-8 text-xs">BOT đang soạn trả lời...</p>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={isSending || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
