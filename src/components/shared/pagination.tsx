"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  /** Trang hiện tại (bắt đầu từ 1) - khớp field `pageNumber` bên backend */
  pageNumber: number;
  /** Tổng số trang - khớp field `totalPages` bên backend */
  totalPages: number;
  /** Tổng số bản ghi - hiển thị thêm cho người dùng biết quy mô danh sách */
  totalItems?: number;
  /** Gọi lại khi người dùng bấm sang trang khác */
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Pagination - thanh phân trang DÙNG CHUNG cho mọi danh sách có phân trang
 * trong hệ thống (danh sách trà, đơn hàng của admin, danh sách người dùng...).
 * Chỉ cần truyền `pageNumber`/`totalPages` lấy thẳng từ response backend
 * (`PaginatedResult<T>`) là dùng được ngay, không cần tính toán lại ở từng
 * trang - tránh lặp code và đảm bảo trải nghiệm phân trang nhất quán.
 *
 * Tự động rút gọn dãy số trang bằng dấu "..." khi có quá nhiều trang, chỉ
 * hiện: trang đầu, trang cuối, trang hiện tại và 1 trang liền kề mỗi bên.
 */
export function Pagination({
  pageNumber,
  totalPages,
  totalItems,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Tính danh sách các "nút" cần hiển thị: số trang thật hoặc "..." (ellipsis)
  const pages: (number | "ellipsis")[] = [];
  const addPage = (p: number) => pages.push(p);

  addPage(1);
  if (pageNumber > 3) pages.push("ellipsis");
  for (
    let p = Math.max(2, pageNumber - 1);
    p <= Math.min(totalPages - 1, pageNumber + 1);
    p++
  ) {
    addPage(p);
  }
  if (pageNumber < totalPages - 2) pages.push("ellipsis");
  if (totalPages > 1) addPage(totalPages);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:justify-between",
        className,
      )}
    >
      {totalItems !== undefined && (
        <p className="text-muted-foreground text-sm">
          Tổng cộng <span className="font-medium text-foreground">{totalItems}</span> kết
          quả
        </p>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
          aria-label="Trang trước"
        >
          <ChevronLeft />
        </Button>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="text-muted-foreground flex size-9 items-center justify-center"
            >
              <MoreHorizontal className="size-4" />
            </span>
          ) : (
            <Button
              key={p}
              variant={p === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(p)}
              aria-current={p === pageNumber ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
          aria-label="Trang sau"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
