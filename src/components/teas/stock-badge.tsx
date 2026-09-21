import { Badge } from "@/components/ui/badge";
import { Tea } from "@/types";

/** StockBadge - hiển thị RÕ RÀNG tình trạng còn/hết hàng của 1 sản phẩm,
 * dùng lại ở cả thẻ sản phẩm (TeaCard) lẫn trang chi tiết. */
export function StockBadge({ tea }: { tea: Tea }) {
  if (!tea.isAvailable || tea.stock <= 0) {
    return <Badge variant="destructive">Hết hàng</Badge>;
  }
  if (tea.stock <= 5) {
    return <Badge variant="warning">Sắp hết ({tea.stock})</Badge>;
  }
  return <Badge variant="success">Còn hàng</Badge>;
}
