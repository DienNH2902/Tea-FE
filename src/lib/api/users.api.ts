import { apiClient } from "./axios-client";
import { PaginatedResult, User } from "@/types";

/** usersApi - dùng cho trang admin quản lý người dùng. Backend `/users`
 * (GET all) hiện CHƯA hỗ trợ phân trang thật (trả về mảng đầy đủ) - hàm
 * `getAll()` tự cắt trang ở phía client để vẫn dùng chung được component
 * `<Pagination />`, và sẽ tự chuyển sang phân trang server-side ngay khi
 * backend bổ sung `pageNumber`/`pageSize` cho endpoint này. */
export const usersApi = {
  getAll: async (pageNumber = 1, pageSize = 10): Promise<PaginatedResult<User>> => {
    const all = await apiClient.get<User[]>("/users").then((r) => r.data);
    const start = (pageNumber - 1) * pageSize;
    return {
      data: all.slice(start, start + pageSize),
      totalItems: all.length,
      pageSize,
      pageNumber,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  },

  update: (id: string, payload: Partial<User>) =>
    apiClient.patch<User>(`/users/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
};
