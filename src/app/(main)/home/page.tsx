"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeaGrid } from "@/components/teas/tea-grid";
import { useTeas } from "@/hooks/use-teas";
import { TEA_TYPE_LABEL_VI, TeaType } from "@/types";
import { TEA_VISUAL } from "@/lib/tea-visual";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

/**
 * HomePage ("/home") - trang chủ sau khi khách "vào cửa hàng" từ Landing
 * Page: gợi ý nhanh theo danh mục + sản phẩm nổi bật, để khách nhanh chóng
 * tìm được thứ mình cần mà không phải vào thẳng trang Cửa hàng đầy đủ.
 */
export default function HomePage() {
  const { data, isLoading } = useTeas(1, 8);
  const setChatWidgetOpen = useUiStore((s) => s.setChatWidgetOpen);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      {/* Banner giới thiệu ngắn + CTA mở Chatbot */}
      <section className="bg-primary text-primary-foreground flex flex-col items-start gap-4 rounded-2xl p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Chưa biết chọn trà nào?</h1>
          <p className="mt-1 opacity-90">Để BOT tư vấn miễn phí, thậm chí đặt hàng giúp bạn ngay trong khung chat.</p>
        </div>
        <Button variant="secondary" size="lg" onClick={() => setChatWidgetOpen(true)}>
          <MessageCircle className="size-4" /> Trò chuyện ngay
        </Button>
      </section>

      {/* Danh mục nhanh theo loại trà */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Duyệt theo loại trà</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Object.values(TeaType).map((type) => {
            const visual = TEA_VISUAL[type];
            const Icon = visual.icon;
            return (
              <Link
                key={type}
                href={`/teas?type=${encodeURIComponent(type)}`}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br p-6 text-white shadow-sm transition-transform hover:scale-[1.03]",
                  visual.gradient,
                )}
              >
                <Icon className="size-8" />
                <span className="text-sm font-medium">{TEA_TYPE_LABEL_VI[type]}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sản phẩm nổi bật</h2>
          <Button variant="ghost" asChild>
            <Link href="/teas">
              Xem tất cả <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <TeaGrid teas={data?.data} isLoading={isLoading} />
      </section>
    </div>
  );
}
