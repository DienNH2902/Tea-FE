"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import { queryKeys } from "@/lib/query-keys";
import {
  LoginPayload,
  RegisterPayload,
  RoleEnum,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from "@/types";
import { toast } from "sonner";
import { setAuthTokens, clearAuthTokens } from "@/lib/cookies";
import { useAuthStore } from "@/store/auth-store";
import { reconnectOrderSocket, disconnectOrderSocket } from "@/lib/socket";

/** useLogin - đăng nhập: gọi API -> lưu token vào cookie -> lưu user vào
 * store -> kết nối lại WebSocket với token mới -> điều hướng theo vai trò
 * (ADMIN/MANAGER vào thẳng "/admin", còn lại vào "/home"). */
export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await authApi.login(payload);

      // LỖI THỰC TẾ ĐÃ XẢY RA: code cũ đọc thẳng `data.user.name` mà
      // KHÔNG kiểm tra `data.user` có tồn tại hay không - nếu response
      // thiếu field này (dù HTTP status vẫn là thành công), toàn bộ
      // `onSuccess` bị crash ngay giữa chừng, khiến token/user KHÔNG BAO
      // GIỜ được lưu và không điều hướng đi đâu cả - trông như "đăng nhập
      // bị lỗi" dù backend đã trả về 200/201. Validate NGAY TẠI ĐÂY (trước
      // khi lan sang `onSuccess`) để lỗi hình dạng dữ liệu rơi đúng vào
      // `onError` (hiện thông báo rõ ràng), không crash cả ứng dụng.
      if (!data?.access_token || !data?.refresh_token || !data?.user) {
        throw new Error(
          "Phản hồi đăng nhập từ máy chủ thiếu dữ liệu cần thiết (token hoặc thông tin người dùng). Vui lòng thử lại hoặc liên hệ quản trị viên.",
        );
      }

      return data;
    },
    onSuccess: (data) => {
      setAuthTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      reconnectOrderSocket();
      toast.success(`Chào mừng trở lại, ${data.user.name}!`);

      // LỖI THỰC TẾ ĐÃ XẢY RA: trước đây LUÔN điều hướng cứng về "/home"
      // (trang dành cho khách hàng) bất kể vai trò gì - khiến đăng nhập
      // bằng tài khoản admin/manager vẫn rơi vào layout khách hàng, phải
      // tự gõ tay URL "/admin" mới vào được layout quản trị. `proxy.ts`
      // (middleware) chỉ CHẶN truy cập sai quyền, không tự ĐƯA người dùng
      // tới đúng khu vực - 2 việc khác nhau, cả 2 đều cần làm.
      const isStaff =
        data.user.role === RoleEnum.ADMIN ||
        data.user.role === RoleEnum.MANAGER;
      router.push(isStaff ? "/admin" : "/home");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** useRegister - đăng ký xong thì điều hướng qua trang đăng nhập (KHÔNG tự
 * đăng nhập luôn, vì backend `/auth/register` chỉ trả về User, không trả token). */
export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      router.push("/login");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** useLogout - xoá token, xoá user khỏi store, ngắt WebSocket, về trang chủ */
export function useLogout() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return () => {
    clearAuthTokens();
    setUser(null);
    disconnectOrderSocket();
    queryClient.clear(); // Xoá sạch cache cũ (đơn hàng, yêu thích...) của người vừa đăng xuất
    toast.success("Đã đăng xuất");
    router.push("/");
  };
}

/** useProfile - lấy hồ sơ đầy đủ, MỘT LẦN đối chiếu với JWT đã giải mã
 * nhanh (dùng ở trang Profile để hiển thị/sửa thông tin chắc chắn mới nhất) */
export function useProfile(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => authApi.getProfile(),
    enabled,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateProfilePayload;
    }) => authApi.updateProfile(userId, payload),
    onSuccess: (updatedUser) => {
      toast.success("Đã cập nhật hồ sơ");
      setUser(updatedUser);
      queryClient.setQueryData(queryKeys.auth.profile, updatedUser);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      authApi.changePassword(payload),
    onSuccess: () => toast.success("Đã đổi mật khẩu thành công"),
    onError: (error: Error) => toast.error(error.message),
  });
}
