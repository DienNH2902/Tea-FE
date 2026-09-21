"use client";
import { useEffect } from "react";
import { getAuthToken, clearAuthTokens } from "@/lib/cookies";
import { decodeToken, isTokenExpired } from "@/lib/jwt";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api/auth.api";
import { reconnectOrderSocket } from "@/lib/socket";

/**
 * AuthProvider - "khởi động" trạng thái đăng nhập MỖI KHI app được tải lại
 * (F5, mở tab mới...). Quy trình:
 *   1. Đọc token từ cookie. Không có/hết hạn -> coi như khách vãng lai.
 *   2. GIẢI MÃ token (đúng yêu cầu "giải mã token vào cookies") để có ngay
 *      thông tin cơ bản (tên, vai trò...) hiển thị tức thì, không phải chờ API.
 *   3. Gọi `/users/profile` ở NỀN để lấy dữ liệu CHẮC CHẮN mới nhất từ DB
 *      (ví dụ admin vừa đổi role/địa chỉ của user này) - ghi đè lại state
 *      khi có kết quả, và tự đăng xuất nếu API báo token không còn hợp lệ.
 *   4. Kết nối WebSocket để bắt đầu nhận cập nhật đơn hàng realtime.
 *
 * Đặt Provider này ở layout gốc (`app/layout.tsx`), bọc NGOÀI CÙNG mọi
 * children, để toàn bộ app luôn biết chắc trạng thái đăng nhập trước khi
 * render bất kỳ trang nào cần tới nó.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    const token = getAuthToken();

    if (!token || isTokenExpired(token)) {
      clearAuthTokens();
      setUser(null);
      setInitializing(false);
      return;
    }

    // Bước 2: hiển thị NGAY thông tin giải mã được từ token, không cần chờ mạng
    const decoded = decodeToken(token);
    if (decoded) {
      setUser({
        _id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        age: decoded.age,
        gender: decoded.gender,
        address: decoded.address,
        isRegular: decoded.isRegular,
      });
      reconnectOrderSocket();
    }

    // Bước 3: đối chiếu lại với server, đảm bảo dữ liệu luôn đúng nhất
    authApi
      .getProfile()
      .then((profile) => setUser(profile))
      .catch(() => {
        clearAuthTokens();
        setUser(null);
      })
      .finally(() => setInitializing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
