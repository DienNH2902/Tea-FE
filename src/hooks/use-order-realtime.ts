"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getOrderSocket } from "@/lib/socket";
import { queryKeys } from "@/lib/query-keys";
import { Order } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

/**
 * useOrderRealtime - LẮNG NGHE sự kiện `order:updated` từ WebSocket và ghi
 * thẳng vào cache TanStack Query bằng `setQueryData` - đây là cơ chế THẬT
 * SỰ đáp ứng yêu cầu "realtime tuyệt đối không reload trang": UI đọc dữ
 * liệu từ cache Query như bình thường (`useOrder`/`useMyOrders`), nhưng
 * cache đó được cập nhật từ 1 nguồn ĐẨY (push) thay vì phải tự hỏi lại
 * (poll) - nên mọi component đang hiển thị đơn hàng đó tự động re-render
 * với dữ liệu mới ngay khi admin đổi trạng thái, ở BẤT KỲ tab/trình duyệt
 * nào đang mở, không cần bấm F5.
 *
 * Gắn 1 lần duy nhất ở layout gốc (`(main)/layout.tsx` và `admin/layout.tsx`)
 * - không cần gọi lại ở từng trang con.
 */
export function useOrderRealtime() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return; // Khách vãng lai không có đơn hàng nào để lắng nghe

    const socket = getOrderSocket();

    const handleOrderUpdated = (order: Order) => {
      // Cập nhật cache "chi tiết 1 đơn" nếu trang đó đang mở
      queryClient.setQueryData(queryKeys.orders.detail(order._id), order);

      // Cập nhật cache "danh sách đơn của tôi" - thay đúng dòng vừa đổi,
      // KHÔNG gọi lại API (giữ đúng tinh thần "không reload").
      queryClient.setQueryData<Order[]>(queryKeys.orders.mine, (old) => {
        if (!old) return old;
        const exists = old.some((o) => o._id === order._id);
        return exists
          ? old.map((o) => (o._id === order._id ? order : o))
          : [order, ...old]; // Đơn mới toanh (ví dụ tạo qua tab/thiết bị khác)
      });

      // Cập nhật cache admin "toàn bộ đơn theo user" nếu đang mở
      queryClient.setQueryData<Order[]>(
        queryKeys.orders.byUser(order.userId),
        (old) =>
          old?.map((o) => (o._id === order._id ? order : o)) ?? old,
      );

      // Cập nhật cache admin "danh sách TOÀN BỘ đơn hàng có phân trang"
      // (trang /admin/orders) - chỉ THAY đúng dòng đã tồn tại trong trang
      // đang cache, KHÔNG tự chèn đơn mới vào giữa 1 trang cụ thể (vì
      // không biết chắc nó thuộc trang nào theo thứ tự sắp xếp) - đơn hàng
      // MỚI sẽ xuất hiện khi admin tự chuyển/tải lại trang.
      queryClient.setQueriesData<{ data: Order[] } | undefined>(
        { predicate: (q) => q.queryKey[0] === "orders" && q.queryKey[1] === "list" },
        (old) => {
          if (!old) return old;
          const exists = old.data.some((o) => o._id === order._id);
          if (!exists) return old;
          return { ...old, data: old.data.map((o) => (o._id === order._id ? order : o)) };
        },
      );

      toast.info(`Đơn hàng #${order._id.slice(-6).toUpperCase()} vừa được cập nhật`);
    };

    socket.on("order:updated", handleOrderUpdated);
    return () => {
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [queryClient, user]);
}
