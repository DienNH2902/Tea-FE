"use client";
import { useSyncExternalStore } from "react";

/** useMediaQuery - theo dõi 1 breakpoint CSS (ví dụ "(min-width: 768px)")
 * để component tự biết đang ở desktop hay mobile mà đổi cách hiển thị
 * (ví dụ Sidebar: cố định ở desktop, trượt ra (Sheet) ở mobile).
 *
 * Dùng `useSyncExternalStore` (thay vì `useEffect` + `useState`) vì đây
 * ĐÚNG bản chất là "đăng ký nghe 1 nguồn dữ liệu ngoài React"
 * (`window.matchMedia`) - đây là API được React khuyến nghị riêng cho
 * trường hợp này, tránh việc gọi `setState` ngay trong thân `useEffect`
 * (có thể gây render dây chuyền không cần thiết). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false, // Giá trị lúc render phía server (không có `window`)
  );
}
