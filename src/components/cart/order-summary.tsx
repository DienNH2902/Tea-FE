import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShopCartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  items: ShopCartItem[];
  action?: React.ReactNode;
}

/**
 * OrderSummary - bảng tóm tắt đơn hàng DÙNG CHUNG cho cả trang Giỏ hàng
 * lẫn trang Checkout, đúng yêu cầu "đơn cần hiện đủ số tiền đơn giá và
 * tổng thể, danh sách các loại trà, số lượng": liệt kê từng loại trà kèm
 * số lượng + đơn giá + thành tiền dòng đó, và TỔNG CỘNG toàn đơn ở cuối.
 */
export function OrderSummary({ items, action }: OrderSummaryProps) {
  const total = items.reduce((sum, i) => sum + i.tea.price * i.quantity, 0);
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.tea._id} className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {item.tea.name} <span className="text-xs">× {item.quantity}</span>
              </span>
              <span className="shrink-0 font-medium">
                {formatCurrency(item.tea.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tổng số lượng</span>
          <span>{totalQuantity} sản phẩm</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>

        {action}
      </CardContent>
    </Card>
  );
}
