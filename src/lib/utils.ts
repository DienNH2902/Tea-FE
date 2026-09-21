import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gộp nhiều class Tailwind lại với nhau, tự động loại bỏ xung đột
 * (ví dụ "p-2 p-4" -> chỉ giữ "p-4"). Đây là helper tiêu chuẩn của mọi
 * component shadcn/ui - hầu như file component nào trong `components/ui`
 * cũng import hàm này.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Định dạng số tiền sang VNĐ, ví dụ 150000 -> "150.000đ" */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Định dạng ngày giờ sang kiểu Việt Nam, ví dụ "14:05, 19/09/2026" */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Lấy 2 ký tự đầu của tên để hiển thị trong Avatar khi không có ảnh đại diện */
export function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}
