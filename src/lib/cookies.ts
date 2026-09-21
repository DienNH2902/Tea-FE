import Cookies from "js-cookie";

/**
 * cookies.ts - LƯU TOKEN XÁC THỰC VÀO COOKIE (theo đúng yêu cầu).
 * ----------------------------------------------------------------------------
 * Dùng cookie (thay vì localStorage) vì: (1) Next.js Middleware (chạy ở edge,
 * TRƯỚC khi trang render) chỉ đọc được cookie, không đọc được localStorage -
 * cần thiết để chặn truy cập trang /admin, /profile... ngay từ server trước
 * khi trang kịp hiển thị; (2) cookie tự động gửi kèm mọi request cùng domain.
 *
 * Cookie ở đây KHÔNG đặt httpOnly (vì được set từ client-side JS ngay sau
 * khi login thành công, không phải từ response header của server) - đây là
 * đánh đổi hợp lý cho 1 SPA gọi thẳng tới NestJS API riêng biệt; nếu cần bảo
 * mật cao hơn nữa (chống XSS đọc trộm token) thì bước tiếp theo là chuyển
 * sang Next.js Route Handler làm proxy + set cookie httpOnly từ server.
 */
const TOKEN_COOKIE_KEY = "tea_shop_token";
const REFRESH_TOKEN_COOKIE_KEY = "tea_shop_refresh_token";

/** Lưu access token + refresh token vào cookie sau khi đăng nhập/đăng ký thành công */
export function setAuthTokens(accessToken: string, refreshToken: string) {
  // maxAge: 7 ngày - đủ dài để không bắt khách đăng nhập lại liên tục,
  // nhưng access token thật (payload JWT) vẫn tự hết hạn theo `exp` riêng.
  Cookies.set(TOKEN_COOKIE_KEY, accessToken, { expires: 7, sameSite: "lax" });
  Cookies.set(REFRESH_TOKEN_COOKIE_KEY, refreshToken, { expires: 7, sameSite: "lax" });
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_COOKIE_KEY);
}

/** Xoá toàn bộ token - gọi khi đăng xuất hoặc khi API trả 401 (token hết hạn) */
export function clearAuthTokens() {
  Cookies.remove(TOKEN_COOKIE_KEY);
  Cookies.remove(REFRESH_TOKEN_COOKIE_KEY);
}
