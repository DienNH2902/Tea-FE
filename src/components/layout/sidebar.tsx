"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/nav-links";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * SidebarNav - phần NỘI DUNG điều hướng dùng chung cho cả 2 nơi hiển thị:
 * Sidebar cố định bên trái (desktop) và Sheet trượt ra (mobile) - tách
 * riêng component này để không viết trùng danh sách link 2 lần.
 */
function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setChatWidgetOpen = useUiStore((s) => s.setChatWidgetOpen);

  const visibleLinks = NAV_LINKS.filter((link) => !link.requiresAuth || !!user);

  return (
    <nav className="flex flex-col gap-1 p-2">
      {visibleLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        const item = (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        );

        if (!collapsed) return item;
        return (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent side="right">{link.label}</TooltipContent>
          </Tooltip>
        );
      })}

      {/* Mở khung Chatbot nổi - không phải 1 trang riêng mà là widget toàn cục */}
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto mt-1"
              onClick={() => setChatWidgetOpen(true)}
            >
              <MessageCircle className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Trò chuyện với BOT</TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="ghost"
          className="mt-1 justify-start gap-3 px-3"
          onClick={() => setChatWidgetOpen(true)}
        >
          <MessageCircle className="size-4" />
          Trò chuyện với BOT
        </Button>
      )}
    </nav>
  );
}

/** Sidebar - thanh điều hướng CỐ ĐỊNH bên trái, dùng cho màn hình desktop
 * (≥ md). Có thể thu gọn chỉ còn icon để dành chỗ cho nội dung chính. */
export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "bg-sidebar border-sidebar-border sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r transition-all duration-200 md:flex md:flex-col",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className="border-sidebar-border border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
    </aside>
  );
}

export { SidebarNav };
