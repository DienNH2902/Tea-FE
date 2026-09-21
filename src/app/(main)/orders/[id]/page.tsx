"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, StickyNote } from "lucide-react";
import { useOrder, useCancelOrder } from "@/hooks/use-orders";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderStatus } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { notFound } from "next/navigation";

/**
 * OrderDetailPage ("/orders/[id]") - chi tiết 1 đơn: danh sách từng loại
 * trà kèm ĐƠN GIÁ + số lượng + thành tiền, và TỔNG CỘNG - đúng yêu cầu
 * hiển thị đầy đủ. Badge trạng thái ở đầu trang tự cập nhật NGAY LẬP TỨC
 * khi admin đổi trạng thái ở nơi khác, nhờ `useOrderRealtime()` đã ghi đè
 * thẳng vào cache Query của đúng `queryKeys.orders.detail(id)` mà hook
 * `useOrder` bên dưới đang đọc - không cần logic gì thêm ở đây.
 */
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (isError) return notFound();

  if (isLoading || !order) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const canCancel = order.status === OrderStatus.PENDING;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link href="/orders" className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm">
        <ChevronLeft className="size-4" /> Quay lại danh sách đơn hàng
      </Link>

      <PageHeader
        title={`Đơn hàng #${order._id.slice(-8).toUpperCase()}`}
        description={formatDateTime(order.createdAt)}
        action={<OrderStatusBadge status={order.status} />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}

          <Separator className="my-2" />

          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin giao hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <MapPin className="text-muted-foreground size-4" /> {order.shippingAddress}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="text-muted-foreground size-4" /> {order.phoneNumber}
          </p>
          {order.note && (
            <p className="flex items-center gap-2">
              <StickyNote className="text-muted-foreground size-4" /> {order.note}
            </p>
          )}
        </CardContent>
      </Card>

      {canCancel && (
        <Button
          variant="destructive"
          onClick={() => cancelOrder.mutate(order._id)}
          disabled={cancelOrder.isPending}
        >
          Huỷ đơn hàng
        </Button>
      )}
    </div>
  );
}
