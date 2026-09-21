"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/orders/order-card";
import { useMyOrders } from "@/hooks/use-orders";

/**
 * OrdersPage ("/orders") - danh sách toàn bộ đơn hàng của khách đang đăng
 * nhập. Trạng thái từng đơn tự cập nhật REALTIME nhờ `useOrderRealtime()`
 * đã được gắn ở `(main)/layout.tsx` - trang này chỉ cần đọc dữ liệu bình
 * thường từ TanStack Query, không cần tự xử lý WebSocket.
 */
export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <PageHeader title="Đơn hàng của tôi" description="Theo dõi trạng thái đơn hàng theo thời gian thực" />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && (!orders || orders.length === 0) && (
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
          <ClipboardList className="size-12" />
          <p>Bạn chưa có đơn hàng nào.</p>
          <Button asChild>
            <Link href="/teas">Mua sắm ngay</Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
