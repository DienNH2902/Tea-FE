import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader - tiêu đề + mô tả ngắn ở đầu MỌI trang nội dung (Cửa hàng,
 * Yêu thích, Giỏ hàng, Đơn hàng, admin...), có chỗ đặt 1 hành động phụ bên
 * phải (`action`, ví dụ nút "Thêm sản phẩm" ở trang admin). Tách thành
 * component riêng để tiêu đề mọi trang có khoảng cách/kiểu chữ NHẤT QUÁN,
 * không phải tự canh chỉnh lại ở từng trang.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
