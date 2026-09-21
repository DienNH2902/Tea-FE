/**
 * ============================================================================
 *  WISHLIST TYPES - "chè yêu thích cá nhân"
 * ----------------------------------------------------------------------------
 * LƯU Ý ĐẶT TÊN QUAN TRỌNG: module `/cart` bên backend thực chất là DANH
 * SÁCH YÊU THÍCH (mỗi mục chỉ có teaId + ghi chú, KHÔNG có số lượng, KHÔNG
 * dùng để tính tiền/đặt hàng trực tiếp) - vì vậy ở frontend ta gọi đúng bản
 * chất là "Wishlist" để không nhầm với GIỎ HÀNG THẬT (có số lượng, dùng để
 * tạo đơn) - xem thêm giải thích ở `src/types/shop-cart.types.ts` và
 * `src/store/cart-store.ts`.
 * ============================================================================
 */

/** 1 mục yêu thích - khớp `ResponseCartDto` bên backend */
export interface WishlistItem {
  _id: string;
  teaId: string;
  teaName: string;
  teaType: string;
  teaPrice: number;
  teaOrigin: string;
  teaStock: number;
  note?: string;
  createdAt: string;
}

/** Payload thêm vào yêu thích - khớp `CreateCartDto` */
export interface AddToWishlistPayload {
  teaId: string;
  note?: string;
}

export interface UpdateWishlistNotePayload {
  note: string;
}
