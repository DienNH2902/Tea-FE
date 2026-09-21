import { apiClient } from "./axios-client";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from "@/types";

/** authApi - toàn bộ lời gọi API liên quan xác thực/hồ sơ người dùng,
 * khớp 1-1 với `AuthController`/`UsersController` bên backend. */
export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<User>("/auth/register", payload).then((r) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  /** Lấy hồ sơ người dùng đang đăng nhập (nguồn dữ liệu "chắc chắn đúng",
   * dùng để đối chiếu lại với thông tin đã giải mã nhanh từ JWT) */
  getProfile: () => apiClient.get<User>("/users/profile").then((r) => r.data),

  updateProfile: (userId: string, payload: UpdateProfilePayload) =>
    apiClient.patch<User>(`/users/${userId}`, payload).then((r) => r.data),

  changePassword: (payload: UpdatePasswordPayload) =>
    apiClient
      .patch<{ message: string }>("/users/profile/change-password", payload)
      .then((r) => r.data),
};
