import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedTokenPayload, RoleEnum } from "@/types";

/**
 * proxy.ts - CHẶN TRUY CẬP ở tầng server, chạy TRƯỚC khi bất kỳ trang
 * nào kịp render (khác với việc chặn trong component, vốn vẫn phải tải
 * xong JS rồi mới "nháy" chuyển hướng - trải nghiệm xấu và không an toàn
 * bằng). Middleware chỉ đọc được cookie (không đọc được localStorage), đây
 * chính là lý do bắt buộc phải lưu token vào cookie như yêu cầu.
 *
 * 2 loại đường dẫn được bảo vệ:
 *   - `PROTECTED_PATHS`: cần đăng nhập (bất kỳ vai trò nào).
 *   - `/admin/*`: cần đăng nhập VÀ có vai trò ADMIN hoặc MANAGER.
 */
const PROTECTED_PATHS = ["/profile", "/orders", "/checkout"];

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p)) || isAdminPath(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const token = request.cookies.get("tea_shop_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = jwtDecode<DecodedTokenPayload>(token);

    // Token hết hạn -> coi như chưa đăng nhập
    if (payload.exp * 1000 < Date.now()) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (
      isAdminPath(pathname) &&
      payload.role !== RoleEnum.ADMIN &&
      payload.role !== RoleEnum.MANAGER
    ) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } catch {
    // Token lỗi định dạng -> coi như chưa đăng nhập
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/checkout/:path*", "/admin/:path*"],
};
