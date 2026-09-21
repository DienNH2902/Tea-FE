import {
  Home,
  Leaf,
  Heart,
  ShoppingCart,
  ClipboardList,
  MessageCircle,
} from "lucide-react";

/**
 * nav-links.ts - danh sách các mục điều hướng hiển thị ở Sidebar. Tách
 * riêng thành config thay vì viết cứng JSX trong `sidebar.tsx` để:
 *   - Dùng lại được cho cả Sidebar desktop (cố định) và Sidebar mobile
 *     (trượt ra từ Sheet) mà không lặp code.
 *   - Sau này thêm/bớt mục chỉ cần sửa 1 mảng ở đây.
 */
export interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** true nếu mục này chỉ hiện với khách ĐÃ đăng nhập */
  requiresAuth?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Trang chủ", href: "/home", icon: Home },
  { label: "Cửa hàng", href: "/teas", icon: Leaf },
  { label: "Yêu thích", href: "/wishlist", icon: Heart, requiresAuth: true },
  { label: "Giỏ hàng", href: "/cart", icon: ShoppingCart },
  { label: "Đơn hàng của tôi", href: "/orders", icon: ClipboardList, requiresAuth: true },
];

export const CHAT_NAV_LINK: NavLink = {
  label: "Trò chuyện với BOT",
  href: "#chat",
  icon: MessageCircle,
};
