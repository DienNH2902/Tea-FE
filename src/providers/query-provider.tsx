"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * QueryProvider - khởi tạo 1 `QueryClient` DUY NHẤT cho toàn bộ vòng đời
 * ứng dụng. Dùng `useState(() => new QueryClient())` thay vì tạo hằng số ở
 * ngoài component - bắt buộc trong Next.js App Router để mỗi request phía
 * server có 1 QueryClient RIÊNG (tránh rò rỉ dữ liệu người dùng này sang
 * người dùng khác khi nhiều request chạy đồng thời trên cùng server).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // Dữ liệu được coi là "còn mới" trong 30s, tránh gọi lại API dư thừa
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
