import { Tea } from "@/types";
import { TeaCard } from "./tea-card";
import { TeaCardSkeleton } from "./tea-card-skeleton";
import { PackageSearch } from "lucide-react";

interface TeaGridProps {
  teas: Tea[] | undefined;
  isLoading: boolean;
}

/** TeaGrid - lưới hiển thị danh sách trà, tự xử lý 3 trạng thái: đang tải
 * (skeleton), rỗng (empty state) và có dữ liệu - dùng chung cho trang Shop,
 * kết quả tìm kiếm, sản phẩm nổi bật ở trang chủ... */
export function TeaGrid({ teas, isLoading }: TeaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TeaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!teas || teas.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
        <PackageSearch className="size-12" />
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {teas.map((tea) => (
        <TeaCard key={tea._id} tea={tea} />
      ))}
    </div>
  );
}
