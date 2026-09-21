/**
 * ============================================================================
 *  SHOP CART TYPES - GIỎ HÀNG THẬT (có số lượng, dẫn tới tạo đơn)
 * ----------------------------------------------------------------------------
 * QUAN TRỌNG: backend KHÔNG có khái niệm "giỏ hàng có số lượng" - chỉ có
 * "yêu thích" (xem `wishlist.types.ts`) và tạo đơn hàng TRỰC TIẾP (1 bước,
 * không qua giỏ). Để đáp ứng yêu cầu "thêm vào giỏ tới khi bấm mua", giỏ
 * hàng này được quản lý HOÀN TOÀN ở phía client (Zustand + localStorage,
 * xem `src/store/cart-store.ts`) - chỉ khi khách bấm "Đặt hàng" ở trang
 * /checkout thì toàn bộ giỏ mới được gửi 1 lần lên `POST /order`.
 * ============================================================================
 */
import { Tea } from "./tea.types";

/** 1 dòng trong giỏ hàng client - lưu "chụp ảnh" thông tin trà lúc thêm vào
 * giỏ (tên, giá, tồn kho) để hiển thị ngay không cần gọi lại API, kèm số
 * lượng khách chọn. */
export interface ShopCartItem {
  tea: Tea;
  quantity: number;
}
