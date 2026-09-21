import axios from "axios";
import { env } from "@/lib/env";
import { getAuthToken, clearAuthTokens } from "@/lib/cookies";

/**
 * axios-client.ts - 1 instance axios DUY NHẤT dùng chung cho toàn bộ app.
 * Mọi file trong `src/lib/api/*.api.ts` đều import từ đây thay vì tự tạo
 * axios riêng, để đảm bảo:
 *   - Luôn tự động gắn header Authorization (đọc token từ cookie)
 *   - Xử lý lỗi 401 (hết hạn đăng nhập) 1 chỗ duy nhất
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: tự gắn Bearer token vào MỌI request nếu đã đăng nhập
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: chuẩn hoá lỗi trả về (NestJS luôn trả `message`)
// và tự dọn token khi phiên đăng nhập hết hạn (401) để tránh vòng lặp gọi
// API thất bại liên tục với token đã chết.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        clearAuthTokens();
      }

      const message = error.response?.data?.message;
      const normalizedMessage = Array.isArray(message)
        ? message.join(", ")
        : message || error.message || "Đã có lỗi xảy ra, vui lòng thử lại";

      return Promise.reject(new Error(normalizedMessage));
    }
    return Promise.reject(error);
  },
);
