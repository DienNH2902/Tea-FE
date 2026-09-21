import Link from "next/link";
import { Leaf, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * not-found.tsx - Next.js TỰ ĐỘNG hiển thị component này khi: (1) truy cập
 * 1 route không tồn tại, hoặc (2) 1 trang chủ động gọi hàm `notFound()`
 * (ví dụ trang chi tiết trà khi `id` không tồn tại trong DB).
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Leaf className="text-primary size-14" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground max-w-sm">
        Trang bạn tìm không tồn tại, hoặc sản phẩm này hiện không còn được bày bán.
      </p>
      <Button asChild>
        <Link href="/home">
          <Home className="size-4" /> Về trang chủ
        </Link>
      </Button>
    </div>
  );
}
