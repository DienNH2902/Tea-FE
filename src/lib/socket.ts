import { io, Socket } from "socket.io-client";
import { env } from "@/lib/env";
import { getAuthToken } from "@/lib/cookies";

/**
 * socket.ts - quản lý 1 kết nối WebSocket DUY NHẤT tới namespace `/orders`
 * của backend (xem `src/modules/order/gateway/orders.gateway.ts` bên
 * NestJS). Đây là nền tảng cho yêu cầu "realtime tuyệt đối không reload
 * trang khi update status đơn": thay vì các trang tự mở nhiều kết nối
 * riêng, chúng dùng chung 1 socket qua `getOrderSocket()`, tránh lãng phí
 * tài nguyên và tránh nhận trùng sự kiện.
 */
let socket: Socket | null = null;

/** Lấy (hoặc tạo mới nếu chưa có) kết nối socket tới backend, tự gắn kèm
 * JWT hiện tại để Gateway biết cho client vào đúng "phòng" (room) nào. */
export function getOrderSocket(): Socket {
  if (socket) return socket;

  socket = io(`${env.socketUrl}/orders`, {
    auth: { token: getAuthToken() ?? null },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

/** Ngắt kết nối hẳn - gọi khi đăng xuất, vì lúc đó token cũ không còn hợp
 * lệ, cần connect lại từ đầu (hoặc không connect nữa nếu vẫn là khách vãng lai). */
export function disconnectOrderSocket() {
  socket?.disconnect();
  socket = null;
}

/** Buộc tạo lại kết nối với token MỚI NHẤT - gọi ngay sau khi đăng nhập
 * thành công, vì lúc app khởi động ban đầu có thể chưa có token để gắn vào
 * socket (khách vừa mở trang, chưa đăng nhập). */
export function reconnectOrderSocket(): Socket {
  disconnectOrderSocket();
  return getOrderSocket();
}
