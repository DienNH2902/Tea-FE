"use client";

import { NavBar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useOrderRealtime } from "@/hooks/use-order-realtime";

/**
 * (main)/layout.tsx - "khung xương" chung cho MỌI trang thuộc khu vực
 * mua sắm (Home, Cửa hàng, Chi tiết trà, Giỏ hàng, Yêu thích, Đơn hàng,
 * Profile...). Landing page ("/") và khu vực Admin KHÔNG dùng layout này -
 * chúng có bố cục riêng phù hợp mục đích riêng.
 *
 * `useOrderRealtime()` được gọi Ở ĐÂY (1 lần cho toàn bộ nhóm trang) thay
 * vì gọi lặp lại ở từng trang con - đảm bảo kết nối WebSocket luôn sẵn
 * sàng bất kể khách đang ở trang nào trong khu vực này.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  useOrderRealtime();

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <Footer />
        <ChatWidget />
      </div>
    </TooltipProvider>
  );
}
