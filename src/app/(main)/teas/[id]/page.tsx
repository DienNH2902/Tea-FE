"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, MapPin, ChevronLeft } from "lucide-react";
import { useTea } from "@/hooks/use-teas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StockBadge } from "@/components/teas/stock-badge";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { TEA_TYPE_LABEL_VI } from "@/types";
import { TEA_VISUAL } from "@/lib/tea-visual";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useAddToWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { notFound } from "next/navigation";

/**
 * TeaDetailPage ("/teas/[id]") - trang thông tin chi tiết 1 sản phẩm: mô
 * tả đầy đủ, xuất xứ, tồn kho, chọn số lượng rồi thêm vào giỏ hoặc yêu thích.
 */
export default function TeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: tea, isLoading, isError } = useTea(id);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const addToWishlist = useAddToWishlist();

  if (isError) return notFound();

  if (isLoading || !tea) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const visual = TEA_VISUAL[tea.type];
  const Icon = visual.icon;
  const canBuy = tea.isAvailable && tea.stock > 0;

  function handleAddToCart() {
    if (!tea) return;
    addToCart(tea, quantity);
    toast.success(`Đã thêm ${quantity} "${tea.name}" vào giỏ hàng`);
  }

  function handleAddToWishlist() {
    if (!user) {
      toast.info("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }
    if (!tea) return;
    addToWishlist.mutate({ teaId: tea._id });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Link
        href="/teas"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm"
      >
        <ChevronLeft className="size-4" /> Quay lại cửa hàng
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div
          className={cn(
            "flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br",
            visual.gradient,
          )}
        >
          <Icon className="size-32 text-white/90" />
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="secondary">{TEA_TYPE_LABEL_VI[tea.type]}</Badge>
            <h1 className="mt-2 text-3xl font-bold">{tea.name}</h1>
            <p className="text-muted-foreground text-sm">{tea.nameEn}</p>
          </div>

          <p className="text-primary text-3xl font-bold">{formatCurrency(tea.price)}</p>

          <div className="flex items-center gap-3">
            <StockBadge tea={tea} />
            {tea.origin && (
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="size-3.5" /> {tea.origin}
              </span>
            )}
          </div>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">{tea.description}</p>

          <Separator />

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Số lượng</span>
            <QuantitySelector value={quantity} onChange={setQuantity} max={tea.stock || 1} />
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1" disabled={!canBuy} onClick={handleAddToCart}>
              <ShoppingCart className="size-4" />
              {canBuy ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </Button>
            <Button size="lg" variant="outline" onClick={handleAddToWishlist}>
              <Heart className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
