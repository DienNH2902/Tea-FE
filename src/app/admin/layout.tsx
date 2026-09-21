"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useOrderRealtime } from "@/hooks/use-order-realtime";

/**
 * admin/layout.tsx - khung riêng cho TOÀN BỘ khu vực quản trị, tách biệt
 * hoàn toàn với layout khách hàng (không NavBar/Footer/ChatWidget). Việc
 * chặn truy cập (chỉ ADMIN/MANAGER) đã xử lý ở `middleware.ts` tại tầng
 * server - layout này chỉ lo bố cục hiển thị.
 *
 * `useOrderRealtime()` cũng được gọi ở đây để trang "Quản lý đơn hàng"
 * luôn nhận cập nhật realtime, kể cả khi đơn được tạo/đổi trạng thái từ
 * phía khách hàng ở 1 tab/thiết bị khác.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useOrderRealtime();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6">{children}</main>
    </div>
  );
}
