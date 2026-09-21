"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LogOut, ArrowLeftCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_LINKS } from "@/lib/admin-nav-links";
import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

/** AdminSidebar - thanh điều hướng cố định của khu vực quản trị, tách hẳn
 * khỏi Sidebar dành cho khách hàng (`components/layout/sidebar.tsx`). */
export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="bg-sidebar border-sidebar-border sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r">
      <div className="flex items-center gap-2 border-b p-4 font-semibold">
        <Leaf className="text-primary size-6" />
        Tea Shop Admin
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t p-2">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/home">
            <ArrowLeftCircle className="size-4" /> Về trang khách hàng
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
          <LogOut className="size-4" /> Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
