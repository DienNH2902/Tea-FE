import { apiClient } from "./axios-client";
import { CreateOrderPayload, Order, PaginatedResult, UpdateOrderStatusPayload } from "@/types";

/** orderApi - toàn bộ lời gọi API liên quan đơn hàng, khớp `OrderController` */
export const orderApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<Order>("/order", payload).then((r) => r.data),

  getMyOrders: () =>
    apiClient
      .get<Order[]>("/order/my-orders")
      .then((r) => r.data)
      .catch(() => [] as Order[]), // Backend trả 404 khi khách chưa có đơn nào

  getById: (id: string) => apiClient.get<Order>(`/order/${id}`).then((r) => r.data),

  updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
    apiClient.patch<Order>(`/order/status/${id}`, payload).then((r) => r.data),

  cancel: (id: string) =>
    apiClient
      .patch<Order>(`/order/status/${id}`, { status: "Cancelled" })
      .then((r) => r.data),

  // ----- Admin -----
  /** Toàn bộ đơn hàng (mọi khách hàng), có phân trang - dùng ở trang admin */
  getAll: (pageNumber = 1, pageSize = 10) =>
    apiClient
      .get<PaginatedResult<Order>>("/order", { params: { pageNumber, pageSize } })
      .then((r) => r.data),

  getAllByUserId: (userId: string) =>
    apiClient.get<Order[]>(`/order/user/${userId}`).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/order/${id}`).then((r) => r.data),
};
