"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

/**
 * StoreHydrationProvider - chủ động nạp lại dữ liệu đã lưu (localStorage)
 * cho các Zustand store dùng `persist` SAU KHI trang đã hydrate xong ở
 * client. Bắt buộc phải làm vậy (thay vì để `persist` tự nạp ngay từ đầu)
 * để tránh lỗi "Hydration failed" - xem giải thích chi tiết trong
 * `src/store/cart-store.ts` (phần comment về `skipHydration`).
 *
 * Nếu sau này thêm store `persist` nào khác, chỉ cần gọi thêm
 * `.persist.rehydrate()` của store đó ở đây.
 */
export function StoreHydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // `rehydrate()` là hàm BẤT ĐỒNG BỘ - cờ `hasHydrated` được đặt `true`
    // trong callback `onRehydrateStorage` khai báo ở `cart-store.ts` (chạy
    // đúng lúc dữ liệu thật sự đọc xong), không đặt thủ công ở đây.
    void useCartStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
