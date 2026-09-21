"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OrderSummary } from "@/components/cart/order-summary";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validations/checkout.schema";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useCreateOrder } from "@/hooks/use-orders";

/**
 * CheckoutPage ("/checkout") - bước cuối cùng của luồng mua hàng: khách
 * nhập địa chỉ/SĐT/ghi chú, xem lại tóm tắt đơn (đơn giá + tổng tiền), rồi
 * bấm "Đặt hàng" để gửi TOÀN BỘ giỏ hàng lên `POST /order` MỘT LẦN DUY
 * NHẤT. Middleware đã yêu cầu đăng nhập trước khi vào được trang này.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const createOrder = useCreateOrder();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: user?.address ?? "",
      phoneNumber: "",
      note: "",
    },
  });

  // Giỏ hàng trống mà vào thẳng /checkout (gõ URL tay, hoặc vừa đặt hàng
  // xong bấm Back) -> đưa về giỏ hàng, tránh gửi đơn rỗng.
  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  function onSubmit(values: CheckoutFormValues) {
    createOrder.mutate(
      {
        items: items.map((i) => ({ teaId: i.tea._id, quantity: i.quantity })),
        shippingAddress: values.shippingAddress,
        phoneNumber: values.phoneNumber,
        note: values.note,
      },
      { onSuccess: (order) => router.push(`/orders/${order._id}`) },
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <PageHeader title="Thanh toán" description="Kiểm tra lại thông tin trước khi đặt hàng" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ giao hàng</FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, đường, phường/xã, quận/huyện..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại nhận hàng</FormLabel>
                      <FormControl>
                        <Input placeholder="09xxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending}>
                  {createOrder.isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <OrderSummary items={items} />
      </div>
    </div>
  );
}
