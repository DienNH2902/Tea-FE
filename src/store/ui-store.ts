import { create } from "zustand";

interface UiState {
  /** Sidebar chính (desktop) đang thu gọn hay mở rộng */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  /** Khung chat nổi (floating chatbot widget) đang mở hay đóng */
  chatWidgetOpen: boolean;
  toggleChatWidget: () => void;
  setChatWidgetOpen: (open: boolean) => void;
}

/** ui-store.ts - các trạng thái giao diện thuần tuý, không liên quan dữ
 * liệu nghiệp vụ (đóng/mở sidebar, đóng/mở khung chat...). */
export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  chatWidgetOpen: false,
  toggleChatWidget: () => set((s) => ({ chatWidgetOpen: !s.chatWidgetOpen })),
  setChatWidgetOpen: (open) => set({ chatWidgetOpen: open }),
}));
