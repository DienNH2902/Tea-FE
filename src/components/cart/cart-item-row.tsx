"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { ShopCartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { TEA_VISUAL } from "@/lib/tea-visual";
import { cn } from "@/lib/utils";

/** CartItemRow - 1 dòng sản phẩm trong giỏ hàng: ảnh/icon, tên, đơn giá,
 * bộ chọn số lượng, THÀNH TIỀN của riêng dòng này, và nút xoá. */
export function CartItemRow({ item }: { item: ShopCartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const visual = TEA_VISUAL[item.tea.type];
  const Icon = visual.icon;

  return (
    <div className="flex items-center gap-4 border-b py-4 last:border-0">
      <div
        className={cn(
          "flex size-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
          visual.gradient,
        )}
      >
        <Icon className="size-7 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/teas/${item.tea._id}`} className="line-clamp-1 font-medium hover:underline">
          {item.tea.name}
        </Link>
        <p className="text-muted-foreground text-sm">Đơn giá: {formatCurrency(item.tea.price)}</p>
      </div>

      <QuantitySelector
        value={item.quantity}
        max={item.tea.stock}
        onChange={(q) => updateQuantity(item.tea._id, q)}
      />

      <p className="w-28 shrink-0 text-right font-semibold">
        {formatCurrency(item.tea.price * item.quantity)}
      </p>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(item.tea._id)}
        aria-label={`Xoá ${item.tea.name} khỏi giỏ hàng`}
      >
        <Trash2 className="text-destructive size-4" />
      </Button>
    </div>
  );
}
