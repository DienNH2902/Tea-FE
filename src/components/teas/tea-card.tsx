"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StockBadge } from "./stock-badge";
import { Tea, TEA_TYPE_LABEL_VI } from "@/types";
import { TEA_VISUAL } from "@/lib/tea-visual";
import { formatCurrency, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useAddToWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";

/**
 * TeaCard - 1 thẻ sản phẩm trong lưới danh sách trà. Là "component con"
 * nhỏ nhất của trang /teas, dùng lại ở cả trang chủ (sản phẩm nổi bật) lẫn
 * trang Cửa hàng đầy đủ - mọi hành động (thêm giỏ, yêu thích) xử lý NGAY
 * tại đây, không cần rời trang.
 */
export function TeaCard({ tea }: { tea: Tea }) {
  const addToCart = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const addToWishlist = useAddToWishlist();
  const visual = TEA_VISUAL[tea.type];
  const Icon = visual.icon;
  const canBuy = tea.isAvailable && tea.stock > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!canBuy) return;
    addToCart(tea, 1);
    toast.success(`Đã thêm "${tea.name}" vào giỏ hàng`);
  }

  function handleAddToWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      toast.info("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }
    addToWishlist.mutate({ teaId: tea._id });
  }

  return (
    <Card className="group overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <Link href={`/teas/${tea._id}`}>
        <div
          className={cn(
            "relative flex h-40 items-center justify-center bg-gradient-to-br",
            visual.gradient,
          )}
        >
          <Icon className="size-16 text-white/90 transition-transform group-hover:scale-110" />
          <Badge variant="secondary" className="absolute top-2 left-2">
            {TEA_TYPE_LABEL_VI[tea.type]}
          </Badge>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 size-8 opacity-90"
            onClick={handleAddToWishlist}
            aria-label="Thêm vào yêu thích"
          >
            <Heart className="size-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="space-y-1.5">
        <Link href={`/teas/${tea._id}`}>
          <h3 className="line-clamp-1 font-semibold hover:underline">{tea.name}</h3>
        </Link>
        <p className="text-muted-foreground line-clamp-2 text-sm">{tea.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-primary font-bold">{formatCurrency(tea.price)}</span>
          <StockBadge tea={tea} />
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" disabled={!canBuy} onClick={handleAddToCart}>
          <ShoppingCart className="size-4" />
          {canBuy ? "Thêm vào giỏ" : "Hết hàng"}
        </Button>
      </CardFooter>
    </Card>
  );
}
