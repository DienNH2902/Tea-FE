"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/order.api";
import { queryKeys } from "@/lib/query-keys";
import { CreateOrderPayload, UpdateOrderStatusPayload } from "@/types";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

/** useMyOrders - danh sách đơn hàng của khách đang đăng nhập (trang "Đơn hàng của tôi") */
export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.mine,
    queryFn: () => orderApi.getMyOrders(),
  });
}

/** useAllOrders - TOÀN BỘ đơn hàng của mọi khách hàng, có phân trang - chỉ
 * dùng ở trang admin "Quản lý đơn hàng" (endpoint yêu cầu quyền ADMIN/MANAGER). */
export function useAllOrders(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: queryKeys.orders.list(pageNumber, pageSize),
    queryFn: () => orderApi.getAll(pageNumber, pageSize),
    placeholderData: (prev) => prev,
  });
}

/** useOrder - chi tiết 1 đơn hàng (khách xem chi tiết / admin xem để cập nhật) */
export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id ?? ""),
    queryFn: () => orderApi.getById(id as string),
    enabled: !!id,
  });
}

/** useCreateOrder - tạo đơn hàng thật từ giỏ hàng (trang /checkout).
 * Sau khi tạo thành công, TỰ ĐỘNG xoá sạch giỏ hàng client. */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clear);

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: () => {
      toast.success("Đặt hàng thành công! Cảm ơn bạn đã ủng hộ Tea Shop 🍵");
      clearCart();
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.teas.all }); // tồn kho vừa đổi
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** useUpdateOrderStatus - admin đổi trạng thái đơn (hoặc khách tự huỷ đơn).
 * KHÔNG cần tự cập nhật cache ở đây - `useOrderRealtime` sẽ nhận sự kiện
 * WebSocket và cập nhật cache NGAY LẬP TỨC cho MỌI tab đang mở, kể cả tab
 * không phải tab vừa bấm nút (đây chính là phần "thật sự realtime"). */
export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusPayload }) =>
      orderApi.updateStatus(id, payload),
    onSuccess: () => toast.success("Đã cập nhật trạng thái đơn hàng"),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelOrder() {
  return useMutation({
    mutationFn: (id: string) => orderApi.cancel(id),
    onSuccess: () => toast.success("Đã huỷ đơn hàng"),
    onError: (error: Error) => toast.error(error.message),
  });
}
