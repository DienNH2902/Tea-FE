"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCartStore } from "@/store/cart-store";

/**
 * CartPage ("/cart") - GIỎ HÀNG THẬT (client-side, có số lượng), nơi khách
 * "thêm vào tới khi bấm mua". Khách vãng lai vẫn xem/sửa được giỏ hàng
 * (không bị middleware chặn) - chỉ khi bấm "Tiến hành đặt hàng" mới cần
 * đăng nhập (chặn ở trang /checkout).
 */
export default function CartPage() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader title="Giỏ hàng" />
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
          <ShoppingCart className="size-12" />
          <p>Giỏ hàng của bạn đang trống.</p>
          <Button asChild>
            <Link href="/teas">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <PageHeader title="Giỏ hàng" description={`${items.length} loại trà trong giỏ`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.tea._id} item={item} />
          ))}
        </Card>

        <OrderSummary
          items={items}
          action={
            <Button className="mt-2 w-full" size="lg" asChild>
              <Link href="/checkout">Tiến hành đặt hàng</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
