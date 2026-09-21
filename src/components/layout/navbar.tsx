"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Leaf, Menu, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLogout } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils";
import { SidebarNav } from "@/components/layout/sidebar";

/**
 * NavBar - thanh điều hướng trên cùng, LUÔN hiển thị ở mọi trang thuộc khu
 * vực "app" (khác trang Landing, vốn có header riêng đơn giản hơn). Theo
 * đúng yêu cầu: chỉ chứa icon Avatar + Giỏ hàng - mọi trang khác nằm ở
 * Sidebar (xem `sidebar.tsx`). Bấm vào Avatar mới mở menu dẫn tới trang
 * Profile - đúng yêu cầu "bấm vào avatar thì mới vào trang profile".
 */
export function NavBar() {
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.totalQuantity());
  const { data: wishlist } = useWishlist();
  const logout = useLogout();
  const { theme, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 h-16 w-full border-b backdrop-blur">
      <div className="flex h-full items-center gap-3 px-4">
        {/* Nút mở Sidebar dạng Sheet trên mobile (< md) */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Mở menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center gap-2">
                <Leaf className="text-primary size-5" />
                Tea Shop
              </SheetTitle>
            </SheetHeader>
            <div onClick={() => setMobileNavOpen(false)}>
              <SidebarNav />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/home" className="flex items-center gap-2 font-semibold">
          <Leaf className="text-primary size-6" />
          <span className="hidden sm:inline">Tea Shop</span>
        </Link>

        <div className="flex-1" />

        {/* Chuyển sáng/tối */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Đổi giao diện sáng/tối"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>

        {/* Yêu thích */}
        <Button variant="ghost" size="icon" className="relative" asChild aria-label="Danh sách yêu thích">
          <Link href="/wishlist">
            <Heart className="size-5" />
            {!!wishlist?.length && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {wishlist.length}
              </Badge>
            )}
          </Link>
        </Button>

        {/* Giỏ hàng */}
        <Button variant="ghost" size="icon" className="relative" asChild aria-label="Giỏ hàng">
          <Link href="/cart">
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Link>
        </Button>

        {/* Avatar - CHỈ nơi duy nhất dẫn vào trang Profile */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Tài khoản">
                <Avatar>
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs font-normal">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User /> Hồ sơ của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">
                  <ShoppingCart /> Đơn hàng của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
