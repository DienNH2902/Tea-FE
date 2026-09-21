"use client";

import Link from "next/link";
import { ArrowRight, Leaf, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { TeaGrid } from "@/components/teas/tea-grid";
import { useTeas } from "@/hooks/use-teas";
import { useAuthStore } from "@/store/auth-store";

/**
 * LandingPage ("/") - trang tiếp thị công khai đầu tiên khách nhìn thấy,
 * TÁCH RIÊNG khỏi bố cục ứng dụng chính (không NavBar/Sidebar) để tập
 * trung vào việc giới thiệu + kêu gọi hành động ("Khám phá cửa hàng").
 * Có header tối giản riêng (logo + nút đăng nhập/vào cửa hàng).
 */
export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useTeas(1, 4);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header tối giản riêng cho Landing Page */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Leaf className="text-primary size-7" />
          Tea Shop
        </div>
        <Button asChild>
          <Link href={user ? "/home" : "/login"}>
            {user ? "Vào cửa hàng" : "Đăng nhập"} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="from-primary/10 flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-b to-transparent px-4 py-20 text-center">
        <span className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
          🍵 Hơn 50+ loại trà chọn lọc
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          Hương vị trà Việt, <span className="text-primary">trọn vẹn</span> trong từng ngụm
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          Từ trà xanh Thái Nguyên tới trà sen Tây Hồ - Tea Shop mang tinh hoa trà Việt đến tận nhà bạn,
          cùng trợ lý AI tư vấn và đặt hàng chỉ trong vài giây.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/teas">
              Khám phá cửa hàng <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={user ? "/home" : "/register"}>{user ? "Trang chủ" : "Tạo tài khoản miễn phí"}</Link>
          </Button>
        </div>
      </section>

      {/* Điểm nổi bật */}
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-3">
        {[
          { icon: Leaf, title: "Trà nguyên chất", desc: "Nguồn gốc rõ ràng, tuyển chọn kỹ càng" },
          { icon: MessageCircle, title: "Tư vấn AI 24/7", desc: "BOT tư vấn & đặt hàng tự động mọi lúc" },
          { icon: Truck, title: "Giao hàng nhanh", desc: "Theo dõi đơn hàng theo thời gian thực" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
              <Icon className="size-6" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* Sản phẩm nổi bật */}
      {!!data?.data.length && (
        <section className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
          <h2 className="text-xl font-semibold">Sản phẩm được yêu thích</h2>
          <TeaGrid teas={data.data} isLoading={false} />
        </section>
      )}

      <section className="bg-primary text-primary-foreground flex flex-col items-center gap-4 px-4 py-14 text-center">
        <ShieldCheck className="size-10" />
        <h2 className="text-2xl font-bold">Sẵn sàng thưởng trà chưa?</h2>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/teas">Mua sắm ngay</Link>
        </Button>
      </section>

      <Footer />
    </div>
  );
}
