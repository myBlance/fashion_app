# Dola Style - Frontend (React + TypeScript)

Đây là mã nguồn Frontend cho dự án **Dola Style**, được xây dựng bằng **React**, **TypeScript** và **Vite**.

## 🚀 Công Nghệ Sử Dụng

-   **Core**: React 18, TypeScript, Vite
-   **UI Framework**: Material UI (MUI) v5
-   **State Management**: Redux Toolkit & React Context
-   **Form & Validation**: React Hook Form, Zod
-   **Routing**: React Router DOM v6
-   **HTTP Client**: Axios
-   **Repository**: [Frontend GitHub](https://github.com/myBlance/fashion_app.git)

---

## 🛠️ Hướng Dẫn Cài Đặt

### 1. Yêu cầu
-   Node.js (v16 trở lên)
-   Backend server đã khởi chạy (xem hướng dẫn tại `../backend/README.md`)

### 2. Cài đặt Packages
Tại thư mục `fashion_app`, chạy lệnh:
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` trong thư mục `fashion_app` (nếu chưa có):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Chạy ứng dụng (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

---

## 📂 Cấu Trúc Thư Mục

```
src/
├── components/         # Các component tái sử dụng (Header, Footer, Card...)
├── contexts/           # Context API (Toast, Theme, ...)
├── hooks/              # Custom Hooks (useCart, useAuth, ...)
├── layouts/            # Layout chính (MainLayout, AdminLayout)
├── pages/              # Các trang giao diện
│   ├── admin/          # Giao diện quản trị (Dashboard, Products, Orders...)
│   └── client/         # Giao diện người dùng (Home, Shop, Cart...)
├── services/           # Gọi API (axios configuration)
├── store/              # Redux store (Slices: cart, user...)
├── styles/             # Styles global & CSS modules
├── types/              # TypeScript definitions
└── utils/              # Các hàm tiện ích
```

## 🌟 Tính Năng Chính
-   **Client**: Mua sắm, giỏ hàng, thanh toán, quản lý tài khoản, xem lịch sử đơn hàng.
-   **Admin**: Thống kê dashboard, quản lý sản phẩm, quản lý đơn hàng, quản lý voucher.

---
*Dola Style Frontend*
