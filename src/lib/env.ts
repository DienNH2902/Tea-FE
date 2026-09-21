/**
 * env.ts - nơi DUY NHẤT đọc biến môi trường, để nếu sau này đổi tên biến
 * thì chỉ cần sửa 1 chỗ thay vì lùng sục process.env khắp project.
 */
export const env = {
  /** Địa chỉ gốc của NestJS backend (REST API) */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  /** Địa chỉ gốc dùng cho WebSocket (thường trùng apiUrl, tách riêng để
   * phòng trường hợp sau này API và WS được deploy ở 2 domain khác nhau) */
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
} as const;
