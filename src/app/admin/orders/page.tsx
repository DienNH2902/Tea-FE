"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { useAllOrders } from "@/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const PAGE_SIZE = 10;

/**
 * AdminOrdersPage ("/admin/orders") - bảng TOÀN BỘ đơn hàng của mọi khách
 * hàng. Đổi trạng thái ngay trong bảng qua `<OrderStatusSelect>`. Nhờ
 * `useOrderRealtime()` đã gắn ở `admin/layout.tsx`, bảng này còn TỰ CẬP
 * NHẬT khi có đơn mới/đổi trạng thái từ phía khách hàng ở nơi khác - đúng
 * yêu cầu "realtime tuyệt đối không reload trang".
 */
export default function AdminOrdersPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isLoading } = useAllOrders(pageNumber, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý đơn hàng" description="Theo dõi và cập nhật trạng thái mọi đơn hàng" />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              data?.data.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <Link href={`/orders/${order._id}`} className="font-mono text-sm hover:underline">
                      #{order._id.slice(-8).toUpperCase()}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p>{order.userName}</p>
                    <p className="text-muted-foreground text-xs">{order.userEmail}</p>
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    <OrderStatusSelect orderId={order._id} status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {data && (
        <Pagination
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          onPageChange={setPageNumber}
        />
      )}
    </div>
  );
}
