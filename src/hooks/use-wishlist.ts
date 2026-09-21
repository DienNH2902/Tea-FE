"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/lib/api/wishlist.api";
import { queryKeys } from "@/lib/query-keys";
import { AddToWishlistPayload } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

/** useWishlist - danh sách "chè yêu thích" của khách đang đăng nhập.
 * Tự động KHÔNG gọi API nếu chưa đăng nhập (endpoint yêu cầu JWT). */
export function useWishlist() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: queryKeys.wishlist.all,
    queryFn: () => wishlistApi.getMy(),
    enabled: !!user,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToWishlistPayload) => wishlistApi.add(payload),
    onSuccess: () => {
      toast.success("Đã thêm vào danh sách yêu thích");
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wishlistApi.remove(id),
    onSuccess: () => {
      toast.success("Đã bỏ khỏi danh sách yêu thích");
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateWishlistNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      wishlistApi.updateNote(id, { note }),
    onSuccess: () => {
      toast.success("Đã cập nhật ghi chú");
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
