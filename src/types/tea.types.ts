/**
 * ============================================================================
 *  TEA TYPES - sản phẩm trà, khớp `ResponseTeaDto`/`CreateTeaDto` backend
 * ============================================================================
 */

/** Loại trà - khớp CHÍNH XÁC enum `TeaType` bên backend (giá trị tiếng Anh,
 * lưu trong DB) - hiển thị cho người dùng cần dịch qua `TEA_TYPE_LABEL_VI`. */
export enum TeaType {
  GREEN_TEA = "Green Tea",
  BLACK_TEA = "Black Tea",
  OOLONG_TEA = "Oolong Tea",
  HERBAL_TEA = "Herbal Tea",
  WHITE_TEA = "White Tea",
}

/** Nhãn tiếng Việt tương ứng từng loại trà - dùng ở mọi nơi hiển thị cho
 * người dùng (thẻ sản phẩm, bộ lọc, trang admin...) thay vì để tiếng Anh thô. */
export const TEA_TYPE_LABEL_VI: Record<TeaType, string> = {
  [TeaType.GREEN_TEA]: "Trà xanh",
  [TeaType.BLACK_TEA]: "Trà đen",
  [TeaType.OOLONG_TEA]: "Trà Ô Long",
  [TeaType.HERBAL_TEA]: "Trà thảo mộc",
  [TeaType.WHITE_TEA]: "Trà trắng",
};

/** 1 sản phẩm trà - khớp `ResponseTeaDto` */
export interface Tea {
  _id: string;
  name: string;
  nameEn: string;
  type: TeaType;
  price: number;
  description: string;
  origin: string;
  stock: number;
  isAvailable: boolean;
}

/** Payload tạo/sửa sản phẩm (trang admin) - khớp `CreateTeaDto`/`UpdateTeaDto` */
export interface TeaPayload {
  name: string;
  nameEn?: string;
  type: TeaType;
  price: number;
  description?: string;
  origin?: string;
  stock?: number;
  isAvailable?: boolean;
}

/** Các tham số lọc/sắp xếp danh sách trà ở trang Shop */
export interface TeaListParams {
  pageNumber?: number;
  pageSize?: number;
}

export enum SortTeaByPrice {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

export enum TeaAvailabilityFilter {
  ALL = "ALL", // Lấy tất cả (Cả 2)
  AVAILABLE = "AVAILABLE", // Chỉ còn hàng (isAvailable: true)
  OUT_OF_STOCK = "OUT_OF_STOCK", // Hết hàng (isAvailable: false)
}

