import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { StoreHydrationProvider } from "@/providers/store-hydration-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Tea Shop - Hương vị trà Việt",
  description:
    "Tea Shop - cửa hàng trà trực tuyến với đầy đủ trà xanh, trà đen, trà Ô Long, trà thảo mộc và trà trắng. Tư vấn miễn phí cùng BOT AI.",
};

/**
 * RootLayout - layout NGOÀI CÙNG của toàn bộ ứng dụng. Thứ tự lồng Provider
 * quan trọng: ThemeProvider ngoài cùng (để mọi thứ bên trong, kể cả Toaster,
 * đều nhận đúng theme sáng/tối) -> QueryProvider (TanStack Query) -> AuthProvider
 * (cần QueryClient đã sẵn sàng để... trong tương lai có thể dùng useQuery cho
 * profile). `suppressHydrationWarning` trên <html> là bắt buộc khi dùng
 * next-themes, vì thư viện này đổi class ngay khi tải trang (trước khi React
 * hydrate xong), nếu không sẽ bị cảnh báo lệch HTML server/client.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <StoreHydrationProvider>
                {children}
                <Toaster />
              </StoreHydrationProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
