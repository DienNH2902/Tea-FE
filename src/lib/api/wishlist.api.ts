import { apiClient } from "./axios-client";
import { AddToWishlistPayload, UpdateWishlistNotePayload, WishlistItem } from "@/types";

/** wishlistApi - gọi tới module `/cart` bên backend (thực chất là "yêu
 * thích", xem giải thích ở `src/types/wishlist.types.ts`). */
export const wishlistApi = {
  getMy: () => apiClient.get<WishlistItem[]>("/cart").then((r) => r.data),

  add: (payload: AddToWishlistPayload) =>
    apiClient.post<WishlistItem>("/cart", payload).then((r) => r.data),

  updateNote: (id: string, payload: UpdateWishlistNotePayload) =>
    apiClient.patch<WishlistItem>(`/cart/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/cart/${id}`).then((r) => r.data),
};
