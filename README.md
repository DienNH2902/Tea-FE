# Tea Shop Frontend

Giao diện web cho hệ thống bán trà (Next.js 15 App Router) - kết nối trực tiếp với backend NestJS (thư mục `ask/`).

## 1. Công nghệ sử dụng

| Nhóm | Công nghệ |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Giao diện | Tailwind CSS v4 + component tự viết theo chuẩn **shadcn/ui** (Radix UI + `class-variance-authority`) - **không dùng thư viện UI dựng sẵn nào khác** |
| Quản lý state server (API) | TanStack Query v5 |
| Quản lý state client | Zustand (giỏ hàng, thông tin đăng nhập, trạng thái giao diện) |
| Validate form | Zod + react-hook-form |
| Realtime | Socket.IO client, kết nối tới Gateway mới thêm ở backend |
| Icon | lucide-react |

> **Lưu ý quan trọng:** vì CLI `shadcn` cần gọi tới `ui.shadcn.com` (bị chặn ở môi trường phát triển dự án này), toàn bộ component trong `src/components/ui/` được viết TAY theo đúng source code chuẩn của shadcn/ui (dùng cùng Radix primitives, cùng class, cùng cấu trúc `data-slot`) - kết quả tương đương 100% với việc chạy `npx shadcn add`.

## 2. Cấu trúc thư mục

```
src/
├── app/                     # Các route (App Router)
│   ├── page.tsx             # Landing Page ("/")
│   ├── (auth)/               # Nhóm route: login, register (layout riêng, không Navbar)
│   ├── (main)/                # Nhóm route: home, teas, cart, checkout, orders, profile, wishlist
│   │                           # (layout dùng chung: NavBar + Sidebar + Footer + ChatWidget)
│   ├── admin/                # Khu vực quản trị (layout + sidebar riêng)
│   └── not-found.tsx         # Trang 404
├── components/
│   ├── ui/                   # Các component nguyên tử kiểu shadcn (Button, Card, Dialog...)
│   ├── layout/                # NavBar, Sidebar, Footer
│   ├── teas/, cart/, orders/, chat/, admin/  # Component nghiệp vụ, chia nhỏ theo từng trang
│   └── shared/                # Dùng chung nhiều nơi: PageHeader, Pagination, QuantitySelector
├── hooks/                    # Custom hook gọi API (TanStack Query) - 1 file / 1 nhóm nghiệp vụ
├── lib/
│   ├── api/                  # Các hàm gọi API thô (axios) - khớp 1-1 với Controller backend
│   ├── validations/           # Schema Zod cho từng form
│   ├── cookies.ts, jwt.ts      # Lưu + giải mã token xác thực
│   └── socket.ts               # Kết nối WebSocket
├── store/                    # Zustand store: auth, giỏ hàng, UI
├── types/                    # TOÀN BỘ type dùng trong app, tách theo domain
└── proxy.ts                  # (middleware) bảo vệ route cần đăng nhập/quyền admin
```

## 3. Cài đặt & chạy

```bash
npm install
cp .env.local.example .env.local   # rồi sửa NEXT_PUBLIC_API_URL trỏ đúng backend
npm run dev
```

Mặc định chạy ở `http://localhost:3000`, gọi API tới `http://localhost:8000` (sửa trong `.env.local` nếu backend chạy cổng khác - ví dụ log trước đó cho thấy có lúc backend chạy ở `2929`).

## 4. Backend cần bổ sung 2 việc (đã làm sẵn trong `ask/`, xem chi tiết bên dưới)

Frontend này gọi thẳng REST API + WebSocket của backend NestJS - những thứ backend **chưa có sẵn** trước khi làm frontend đã được bổ sung:

1. **CORS** (`ask/src/main.ts`): thêm `app.enableCors(...)` - nếu không có, trình duyệt sẽ tự chặn mọi request từ `localhost:3000` sang backend.
2. **WebSocket Gateway** (`ask/src/modules/order/gateway/orders.gateway.ts` - file MỚI): backend trước đó hoàn toàn chưa có hạ tầng realtime. Gateway này lắng nghe kết nối, cho khách vào "phòng" riêng theo `userId` (giải mã từ JWT lúc connect), và đẩy sự kiện `order:updated` mỗi khi `OrdersService.create()`/`updateStatus()` chạy xong. Đã cài thêm `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io` vào backend.
3. **Endpoint mới** `GET /order` (`ask/src/modules/order/order.controller.ts`): backend trước đó chỉ có "đơn của tôi" và "đơn theo 1 userId cụ thể" - KHÔNG có cách nào lấy TOÀN BỘ đơn hàng của mọi khách hàng (cần cho trang `/admin/orders`). Đã bổ sung, có phân trang, giới hạn quyền ADMIN/MANAGER.

Nhớ chạy lại `npm install` ở thư mục backend (`ask/`) để cài 3 package WebSocket mới trước khi khởi động backend.

## 5. Cách "Giỏ hàng" hoạt động (điểm dễ gây nhầm lẫn nhất)

Backend có 2 khái niệm dễ nhầm với nhau:

- **`/cart` (backend)** = thực chất là **DANH SÁCH YÊU THÍCH** (mỗi mục chỉ có `teaId` + ghi chú, KHÔNG có số lượng, không dùng để tính tiền). Ở frontend, đây là trang **`/wishlist`**.
- **Giỏ hàng thật** (có số lượng, dùng để tạo đơn) - backend **KHÔNG có** khái niệm này. Toàn bộ được quản lý ở client bằng Zustand (`src/store/cart-store.ts`, lưu localStorage) - khách thêm/sửa/xoá thoải mái, tới khi bấm "Đặt hàng" ở trang `/checkout` thì mới gửi TOÀN BỘ giỏ lên `POST /order` một lần duy nhất.

## 6. Realtime hoạt động thế nào (không reload trang)

```
Admin đổi trạng thái đơn (PATCH /order/status/:id)
  → OrdersService cập nhật DB xong
  → OrdersGateway.emitOrderUpdated() bắn sự kiện "order:updated"
      tới đúng room "user:<userId của khách>" + room "admin-orders"
  → Mọi tab trình duyệt đang mở (khách hàng lẫn admin) nhận được sự kiện
  → useOrderRealtime() (src/hooks/use-order-realtime.ts) ghi thẳng dữ liệu
      mới vào cache TanStack Query bằng setQueryData/setQueriesData
  → Component đọc cache như bình thường -> tự re-render với dữ liệu mới,
      KHÔNG gọi lại API, KHÔNG reload trang.
```

## 7. Tài khoản test gợi ý

Đăng ký tài khoản mới qua `/register`, sau đó dùng công cụ quản trị DB (Compass/Studio 3T) đổi field `role` của user đó thành `2` (Admin) hoặc `3` (Manager) để truy cập `/admin`.
