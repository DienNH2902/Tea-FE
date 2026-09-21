import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShopCartItem } from "@/types";
import { Tea } from "@/types";

interface CartState {
  items: ShopCartItem[];
  /** true SAU KHI đã đọc xong dữ liệu giỏ hàng từ localStorage ở client -
   * xem giải thích ở `skipHydration` bên dưới. */
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  /** Thêm sản phẩm vào giỏ - nếu đã có thì cộng dồn số lượng (không tạo
   * dòng trùng), và tự động GHIM số lượng không vượt quá tồn kho hiện có. */
  addItem: (tea: Tea, quantity?: number) => void;
  removeItem: (teaId: string) => void;
  updateQuantity: (teaId: string, quantity: number) => void;
  clear: () => void;
  /** Tổng số lượng sản phẩm (dùng hiển thị badge số trên icon giỏ hàng ở NavBar) */
  totalQuantity: () => number;
  /** Tổng tiền toàn bộ giỏ hàng */
  totalPrice: () => number;
}

/**
 * cart-store.ts - GIỎ HÀNG THẬT (có số lượng), sống hoàn toàn ở client vì
 * backend không có khái niệm này (xem giải thích chi tiết trong
 * `src/types/shop-cart.types.ts`). Dùng middleware `persist` để lưu vào
 * localStorage - khách đóng tab/tắt trình duyệt rồi quay lại vẫn còn giỏ
 * hàng, đúng hành vi người dùng mong đợi ở mọi trang thương mại điện tử.
 *
 * `skipHydration: true` + tự gọi `persist.rehydrate()` (xem
 * `src/providers/store-hydration-provider.tsx`) LÀ BẮT BUỘC với
 * Next.js App Router: nếu để `persist` tự động nạp localStorage ngay lúc
 * tạo store như mặc định, lần render ĐẦU TIÊN ở client (ngay sau khi
 * hydrate xong HTML từ server) sẽ đã có dữ liệu giỏ hàng, trong khi HTML
 * server render ra luôn là giỏ hàng RỖNG (server không có localStorage) -
 * gây lỗi "Hydration failed" ngay lập tức. Bật `skipHydration` để 2 lần
 * render đầu tiên (server + client) LUÔN khớp nhau (đều rỗng), rồi mới
 * chủ động nạp dữ liệu thật SAU KHI hydrate xong (là 1 update bình
 * thường, không còn thuộc quá trình so khớp hydration nữa).
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addItem: (tea, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.tea._id === tea._id);
          if (existing) {
            const nextQuantity = Math.min(existing.quantity + quantity, tea.stock);
            return {
              items: state.items.map((i) =>
                i.tea._id === tea._id ? { ...i, quantity: nextQuantity } : i,
              ),
            };
          }
          return {
            items: [...state.items, { tea, quantity: Math.min(quantity, tea.stock) }],
          };
        });
      },

      removeItem: (teaId) =>
        set((state) => ({ items: state.items.filter((i) => i.tea._id !== teaId) })),

      updateQuantity: (teaId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.tea._id === teaId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.tea.stock)) }
              : i,
          ),
        })),

      clear: () => set({ items: [] }),

      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.quantity * i.tea.price, 0),
    }),
    {
      name: "tea-shop-cart",
      skipHydration: true, // key lưu trong localStorage
      // Đánh dấu "đã nạp xong" NGAY KHI persist thực sự đọc xong
      // localStorage (bất kể có dữ liệu cũ hay không) - đáng tin cậy hơn
      // tự đặt cờ thủ công ngay sau khi GỌI `rehydrate()`, vì đó là hàm
      // bất đồng bộ (`rehydrate()` trả về Promise).
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
