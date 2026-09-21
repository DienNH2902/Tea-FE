import { Badge } from "@/components/ui/badge";
import { Order, ORDER_STATUS_META } from "@/types";

/** OrderStatusBadge - nhãn trạng thái đơn hàng, dùng thống nhất ở danh
 * sách đơn, chi tiết đơn, và trang admin quản lý đơn. */
export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const meta = ORDER_STATUS_META[status];
  return <Badge variant={meta.badgeVariant}>{meta.label}</Badge>;
}
