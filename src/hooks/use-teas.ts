"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teaApi } from "@/lib/api/tea.api";
import { queryKeys } from "@/lib/query-keys";
import { TeaAvailabilityFilter, TeaPayload, TeaType } from "@/types";
import { toast } from "sonner";

/** useTeas - lấy danh sách trà CÓ PHÂN TRANG, dùng cho trang Shop và trang
 * admin quản lý sản phẩm. */
export function useTeas(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: queryKeys.teas.list(pageNumber, pageSize),
    queryFn: () => teaApi.getAll(pageNumber, pageSize),
    placeholderData: (prev) => prev, // Giữ dữ liệu trang cũ trong lúc tải trang mới - đỡ giật layout
  });
}

/** useTea - lấy chi tiết 1 sản phẩm (trang chi tiết trà) */
export function useTea(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.teas.detail(id ?? ""),
    queryFn: () => teaApi.getById(id as string),
    enabled: !!id, // Chỉ gọi API khi đã có id (tránh gọi với id rỗng lúc mới mount)
  });
}

/** useSearchTeas - tìm theo tên (ô tìm kiếm ở trang Shop) */
export function useSearchTeas(name: string) {
  return useQuery({
    queryKey: queryKeys.teas.search(name),
    queryFn: () => teaApi.searchByName(name),
    enabled: name.trim().length > 0,
  });
}

/** useTeasByType - lọc theo loại trà (bộ lọc ở trang Shop) */
export function useTeasByType(type: TeaType | undefined) {
  return useQuery({
    queryKey: queryKeys.teas.byType(type ?? ""),
    queryFn: () => teaApi.getByType(type as TeaType),
    enabled: !!type,
  });
}

/** useAvalaibleTeas - lọc theo còn hàng */
export function useTeasAvailable(status: TeaAvailabilityFilter | undefined) {
  return useQuery({
    queryKey: queryKeys.teas.byType(status ?? ""),
    queryFn: () => teaApi.getAvailable(status as TeaAvailabilityFilter),
    enabled: !!status,
  });
}

/** useCreateTea - admin tạo sản phẩm mới */
export function useCreateTea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TeaPayload) => teaApi.create(payload),
    onSuccess: () => {
      toast.success("Đã thêm sản phẩm mới");
      queryClient.invalidateQueries({ queryKey: queryKeys.teas.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** useUpdateTea - admin sửa sản phẩm */
export function useUpdateTea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TeaPayload>;
    }) => teaApi.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success("Đã cập nhật sản phẩm");
      queryClient.invalidateQueries({ queryKey: queryKeys.teas.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teas.detail(variables.id),
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** useDeleteTea - admin xoá sản phẩm */
export function useDeleteTea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teaApi.remove(id),
    onSuccess: () => {
      toast.success("Đã xoá sản phẩm");
      queryClient.invalidateQueries({ queryKey: queryKeys.teas.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
