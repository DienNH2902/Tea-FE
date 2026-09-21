import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** TeaCardSkeleton - khung "xương" hiển thị trong lúc `useTeas` đang tải,
 * giữ đúng kích thước TeaCard thật để tránh giật layout khi dữ liệu về. */
export function TeaCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
