"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { teaApi } from "@/lib/api/tea.api";
import { toast } from "sonner";

/**
 * WishlistPage ("/wishlist") - "chè yêu thích cá nhân" của khách hàng
 * (module `/cart` bên backend). Middleware đã chặn khách vãng lai truy cập
 * trang này ở tầng route, nhưng Sidebar/NavBar cũng đã ẩn link tương ứng.
 */
export default function WishlistPage() {
  const { data: items, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useCartStore((s) => s.addItem);

  async function handleAddToCart(teaId: string, teaName: string) {
    try {
      // Wishlist chỉ lưu snapshot giá/tên tại thời điểm thêm - lấy lại dữ
      // liệu MỚI NHẤT của sản phẩm (giá/tồn kho có thể đã đổi) trước khi bỏ
      // vào giỏ hàng thật, tránh giỏ hàng mang giá cũ.
      const freshTea = await teaApi.getById(teaId);
      addToCart(freshTea, 1);
      toast.success(`Đã thêm "${teaName}" vào giỏ hàng`);
    } catch {
      toast.error("Sản phẩm này hiện không còn tồn tại");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <PageHeader title="Chè yêu thích của tôi" description="Những sản phẩm bạn đã lưu lại để mua sau" />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && (!items || items.length === 0) && (
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
          <Heart className="size-12" />
          <p>Bạn chưa có sản phẩm yêu thích nào.</p>
          <Button asChild>
            <Link href="/teas">Khám phá cửa hàng</Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {items?.map((item) => (
          <Card key={item._id}>
            <CardContent className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <Link href={`/teas/${item.teaId}`} className="font-semibold hover:underline">
                  {item.teaName}
                </Link>
                <p className="text-muted-foreground text-sm">{item.teaType}</p>
                <p className="text-primary font-medium">{formatCurrency(item.teaPrice)}</p>
                {item.note && <p className="text-muted-foreground mt-1 text-xs italic">Ghi chú: {item.note}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item.teaId, item.teaName)}
                  disabled={item.teaStock <= 0}
                >
                  <ShoppingCart className="size-4" /> Thêm vào giỏ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFromWishlist.mutate(item._id)}
                  aria-label="Bỏ khỏi yêu thích"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
