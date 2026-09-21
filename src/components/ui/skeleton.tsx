import { cn } from "@/lib/utils";

/** Skeleton - khối "xương" nhấp nháy khi dữ liệu đang tải (loading state) */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
