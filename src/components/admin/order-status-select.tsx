"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, ORDER_STATUS_META } from "@/types";
import { useUpdateOrderStatus } from "@/hooks/use-orders";

/**
 * OrderStatusSelect - dropdown đổi trạng thái đơn NGAY TRONG bảng, không
 * cần mở trang riêng. Sau khi gọi API thành công, KHÔNG cần tự cập nhật
 * giao diện thủ công - sự kiện WebSocket `order:updated` (xem
 * `useOrderRealtime`) sẽ tự làm việc đó cho TẤT CẢ nơi đang hiển thị đơn
 * này, kể cả chính dropdown này.
 */
export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const updateStatus = useUpdateOrderStatus();

  return (
    <Select
      value={status}
      onValueChange={(next) =>
        updateStatus.mutate({ id: orderId, payload: { status: next as OrderStatus } })
      }
      disabled={updateStatus.isPending}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ORDER_STATUS_META).map(([value, meta]) => (
          <SelectItem key={value} value={value}>
            {meta.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
