import { jwtDecode } from "jwt-decode";
import { DecodedTokenPayload } from "@/types";

/**
 * jwt.ts - GIẢI MÃ token đã lưu trong cookie (theo đúng yêu cầu "lưu và
 * giải mã token vào cookies"). Chỉ GIẢI MÃ (đọc payload), KHÔNG xác thực
 * chữ ký - việc xác thực chữ ký luôn do backend đảm nhiệm ở mọi API call;
 * giải mã ở client chỉ để lấy nhanh thông tin hiển thị (tên, vai trò...)
 * mà không cần gọi thêm API.
 */
export function decodeToken(token: string): DecodedTokenPayload | null {
  try {
    return jwtDecode<DecodedTokenPayload>(token);
  } catch {
    return null;
  }
}

/** Kiểm tra token đã hết hạn theo trường `exp` trong payload hay chưa */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}
