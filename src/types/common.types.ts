/**
 * ============================================================================
 *  COMMON TYPES - các kiểu dữ liệu dùng chung, không thuộc riêng 1 nghiệp vụ
 * ============================================================================
 */

/** Kết quả phân trang - PHẢI khớp CHÍNH XÁC với `PaginatedResult<T>` bên
 * backend (`src/interface/pagination.interface.ts`) để component
 * `<Pagination />` dùng chung cho toàn hệ thống hoạt động đúng. */
export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

/** Hình dạng lỗi trả về từ NestJS khi request thất bại (ValidationPipe,
 * exception filter mặc định...) - dùng để hiển thị message lỗi cho người dùng. */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
