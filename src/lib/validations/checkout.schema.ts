import { z } from "zod";

/** Schema form thanh toán/đặt hàng - khớp validation `CreateOrderDto`
 * (phần thông tin giao hàng; danh sách sản phẩm lấy trực tiếp từ giỏ hàng
 * Zustand nên không cần validate lại ở đây). */
export const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, "Địa chỉ giao hàng phải có ít nhất 5 ký tự"),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^0\d{9}$/, "Số điện thoại phải bắt đầu bằng 0 và đủ 10 số"),
  note: z.string().optional(),
});
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
