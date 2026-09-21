import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { Order } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

/** OrderCard - 1 dòng tóm tắt đơn hàng trong danh sách "Đơn hàng của tôi",
 * bấm vào để xem chi tiết đầy đủ (danh sách sản phẩm, trạng thái realtime). */
export function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm font-medium">
              #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-muted-foreground text-xs">{formatDateTime(order.createdAt)}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {order.items.length} loại trà · {order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
            </p>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <OrderStatusBadge status={order.status} />
            <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
