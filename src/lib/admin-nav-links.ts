import { LayoutDashboard, Leaf, ClipboardList, Users } from "lucide-react";
import { NavLink } from "./nav-links";

/** Danh sách điều hướng RIÊNG cho khu vực quản trị - tách khỏi `nav-links.ts`
 * (dành cho khách hàng thường) vì 2 khu vực có mục đích hoàn toàn khác nhau. */
export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Sản phẩm", href: "/admin/teas", icon: Leaf },
  { label: "Đơn hàng", href: "/admin/orders", icon: ClipboardList },
  { label: "Người dùng", href: "/admin/users", icon: Users },
];
