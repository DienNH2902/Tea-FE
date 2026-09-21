/**
 * query-keys.ts - khai báo TẬP TRUNG toàn bộ "khoá" cache của TanStack
 * Query. Lý do cần tập trung: khi 1 hành động (ví dụ tạo đơn hàng) cần làm
 * mới dữ liệu ở nhiều nơi khác (danh sách đơn, tồn kho sản phẩm...), viết
 * tay chuỗi khoá ở nhiều file rất dễ gõ sai/lệch nhau khiến cache không bao
 * giờ được làm mới đúng chỗ. Import từ đây thì luôn khớp 100%.
 */
export const queryKeys = {
  teas: {
    all: ["teas"] as const,
    list: (page: number, size: number) => ["teas", "list", page, size] as const,
    detail: (id: string) => ["teas", "detail", id] as const,
    search: (name: string) => ["teas", "search", name] as const,
    byType: (type: string) => ["teas", "byType", type] as const,
  },
  wishlist: {
    all: ["wishlist"] as const,
  },
  orders: {
    all: ["orders"] as const,
    mine: ["orders", "mine"] as const,
    list: (page: number, size: number) => ["orders", "list", page, size] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    byUser: (userId: string) => ["orders", "byUser", userId] as const,
  },
  auth: {
    profile: ["auth", "profile"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (page: number, size: number) => ["users", "list", page, size] as const,
  },
} as const;
