"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users.api";
import { queryKeys } from "@/lib/query-keys";
import { User } from "@/types";
import { toast } from "sonner";

/** useUsers - danh sách người dùng (trang admin) */
export function useUsers(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: queryKeys.users.list(pageNumber, pageSize),
    queryFn: () => usersApi.getAll(pageNumber, pageSize),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      usersApi.update(id, payload),
    onSuccess: () => {
      toast.success("Đã cập nhật người dùng");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      toast.success("Đã xoá người dùng");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
