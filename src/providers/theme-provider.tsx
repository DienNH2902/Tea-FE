"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/** ThemeProvider - bật/tắt dark mode toàn hệ thống, đồng bộ với hệ điều
 * hành (`system`) hoặc do người dùng tự chọn, lưu lựa chọn vào localStorage. */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
