/**
 * ============================================================================
 *  ORDER TYPES - đơn hàng, khớp `ResponseOrderDto`/`CreateOrderDto` backend
 * ============================================================================
 */

/** Trạng thái đơn hàng - khớp CHÍNH XÁC enum `OrderStatus` bên backend */
export enum OrderStatus {
  PENDING = "Pending",
  PAID = "Paid",
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

/** Nhãn tiếng Việt + màu Badge tương ứng từng trạng thái - dùng thống nhất
 * ở mọi nơi hiển thị trạng thái đơn (trang "Đơn hàng của tôi", admin...). */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeVariant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" }
> = {
  [OrderStatus.PENDING]: { label: "Chờ xử lý", badgeVariant: "secondary" },
  [OrderStatus.PAID]: { label: "Đã thanh toán", badgeVariant: "default" },
  [OrderStatus.PROCESSING]: { label: "Đang xử lý", badgeVariant: "warning" },
  [OrderStatus.SHIPPED]: { label: "Đang giao", badgeVariant: "default" },
  [OrderStatus.DELIVERED]: { label: "Đã giao", badgeVariant: "success" },
  [OrderStatus.CANCELLED]: { label: "Đã huỷ", badgeVariant: "destructive" },
};

/** 1 dòng sản phẩm trong đơn hàng - khớp `ResponseOrderItemDto` (đã "chụp
 * ảnh" tên + giá tại thời điểm mua, không đổi dù sản phẩm gốc đổi giá sau này) */
export interface OrderItem {
  teaId: string;
  name: string;
  quantity: number;
  price: number;
}

/** 1 đơn hàng đầy đủ - khớp `ResponseOrderDto` */
export interface Order {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAddress: string;
  isRegular: boolean;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  phoneNumber: string;
  note?: string;
  createdAt: string;
}

/** 1 dòng sản phẩm khi TẠO đơn - khớp `CreateOrderItemDto` (chỉ cần
 * teaId + quantity, giá/tên do backend tự tính lại từ DB, không tin
 * client gửi lên để tránh gian lận giá). */
export interface CreateOrderItemPayload {
  teaId: string;
  quantity: number;
}

/** Payload tạo đơn hàng - khớp `CreateOrderDto` */
export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  shippingAddress: string;
  phoneNumber: string;
  note?: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
