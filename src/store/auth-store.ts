import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  /** Thông tin người dùng đang đăng nhập - null nếu là khách vãng lai */
  user: User | null;
  /** true cho tới khi lần kiểm tra cookie/profile ĐẦU TIÊN hoàn tất - dùng
   * để tránh "nháy" giao diện (ví dụ hiện nhầm nút Đăng nhập trong 1 khắc
   * rồi mới đổi thành Avatar) trong lúc app vừa tải xong. */
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (value: boolean) => void;
}

/**
 * auth-store.ts - lưu THÔNG TIN NGƯỜI DÙNG (không lưu token - token nằm ở
 * cookie, xem `src/lib/cookies.ts`) để mọi component (NavBar, Sidebar,
 * trang admin...) đọc nhanh mà không cần gọi lại API `/users/profile` mỗi
 * lần render. Được đồng bộ bởi `AuthProvider` (`src/providers/auth-provider.tsx`)
 * - nơi DUY NHẤT được phép gọi `setUser`.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (value) => set({ isInitializing: value }),
}));
