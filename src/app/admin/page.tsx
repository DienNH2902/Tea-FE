"use client";

import { Leaf, ClipboardList, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useTeas } from "@/hooks/use-teas";
import { useAllOrders } from "@/hooks/use-orders";
import { useUsers } from "@/hooks/use-users";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}

/** StatCard - 1 ô thống kê nhanh trên trang Tổng quan admin. */
function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">{value}</p>}
      </CardContent>
    </Card>
  );
}

/**
 * AdminDashboardPage ("/admin") - trang tổng quan quản trị: vài con số
 * quan trọng nhất (sản phẩm, đơn hàng, doanh thu trang hiện tại, người
 * dùng) để admin nắm nhanh tình hình khi vừa đăng nhập.
 */
export default function AdminDashboardPage() {
  const { data: teas, isLoading: teasLoading } = useTeas(1, 1);
  const { data: orders, isLoading: ordersLoading } = useAllOrders(1, 50);
  const { data: users, isLoading: usersLoading } = useUsers(1, 1);

  const revenue = orders?.data.reduce((sum, o) => sum + o.totalPrice, 0) ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Tổng quan" description="Số liệu nhanh về cửa hàng" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sản phẩm" value={teas?.totalItems ?? 0} icon={Leaf} isLoading={teasLoading} />
        <StatCard label="Tổng đơn hàng" value={orders?.totalItems ?? 0} icon={ClipboardList} isLoading={ordersLoading} />
        <StatCard label="Người dùng" value={users?.totalItems ?? 0} icon={Users} isLoading={usersLoading} />
        <StatCard
          label="Doanh thu (50 đơn gần nhất)"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          isLoading={ordersLoading}
        />
      </div>
    </div>
  );
}
