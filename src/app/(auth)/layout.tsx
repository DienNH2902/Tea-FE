import Link from "next/link";
import { Leaf } from "lucide-react";

/**
 * (auth)/layout.tsx - bố cục TỐI GIẢN riêng cho trang Đăng nhập/Đăng ký:
 * không có NavBar/Sidebar (vì lúc này thường CHƯA có tài khoản để hiển
 * thị các mục đó), chỉ có logo dẫn về trang chủ và khung form ở giữa màn hình.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <Leaf className="text-primary size-7" />
        Tea Shop
      </Link>
      {children}
    </div>
  );
}
