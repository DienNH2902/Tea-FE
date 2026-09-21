import Link from "next/link";
import { Leaf, Share2, Mail, Phone } from "lucide-react";

/** Footer - chân trang cơ bản, hiển thị ở mọi trang thuộc khu vực "app". */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link href="/home" className="flex items-center gap-2 font-semibold">
            <Leaf className="text-primary size-5" />
            Tea Shop
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">
            Hương vị trà Việt, chọn lọc từ những vùng trà nổi tiếng nhất.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Khám phá</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li><Link href="/teas" className="hover:text-foreground">Cửa hàng</Link></li>
            <li><Link href="/home" className="hover:text-foreground">Trang chủ</Link></li>
            <li><Link href="/wishlist" className="hover:text-foreground">Yêu thích</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Hỗ trợ</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-3.5" /> 1900 0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-3.5" /> support@teashop.vn
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Kết nối</h3>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Share2 className="size-4" /> Theo dõi chúng tôi trên mạng xã hội
          </div>
        </div>
      </div>

      <div className="text-muted-foreground border-t py-4 text-center text-xs">
        © {year} Tea Shop. Đồ án minh hoạ, không phải cửa hàng thật.
      </div>
    </footer>
  );
}
