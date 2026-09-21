import { apiClient } from "./axios-client";
import { PaginatedResult, Tea, TeaAvailabilityFilter, TeaPayload, TeaType } from "@/types";

/** teaApi - toàn bộ lời gọi API liên quan sản phẩm trà, khớp `TeaController` */
export const teaApi = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    apiClient
      .get<PaginatedResult<Tea>>("/tea", { params: { pageNumber, pageSize } })
      .then((r) => r.data),

  getById: (id: string) => apiClient.get<Tea>(`/tea/${id}`).then((r) => r.data),

  getByType: (type: TeaType) =>
    apiClient
      .get<Tea[]>("/tea/byTeaType", { params: { TeaType: type } })
      .then((r) => r.data)
      .catch(() => [] as Tea[]), // Backend trả 404 khi rỗng - coi như danh sách rỗng

  getAvailable: (status: TeaAvailabilityFilter) =>
    apiClient
      .get<Tea[]>("/tea/available", { params: { status: status } })
      .then((r) => r.data)
      .catch(() => [] as Tea[]), // Backend trả 404 khi rỗng - coi như danh sách rỗng

  searchByName: (name: string) =>
    apiClient
      .get<Tea[]>("/tea/byTeaName", { params: { TeaName: name } })
      .then((r) => r.data)
      .catch(() => [] as Tea[]),

  // ----- Admin -----
  create: (payload: TeaPayload) =>
    apiClient.post<Tea>("/tea", payload).then((r) => r.data),

  update: (id: string, payload: Partial<TeaPayload>) =>
    apiClient.patch<Tea>(`/tea/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/tea/${id}`).then((r) => r.data),
};
