# Bando - Real Estate API

Hệ thống API quản lý bất động sản với hỗ trợ tìm kiếm dựa trên vị trí (PostGIS).

## Công nghệ sử dụng
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL + PostGIS
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Token)
- **Container:** Docker & Docker Compose

## Cấu trúc thư mục
```
src/
├── controllers/    # Xử lý logic nghiệp vụ
├── routes/         # Định nghĩa các đầu API
├── services/       # Tầng giao tiếp database
├── middleware/     # Auth, Role validation
├── config/         # Cấu hình hệ thống
└── server.js      # Khởi chạy server
```

## Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Đã cài đặt **Node.js** (v14+)
- Đã cài đặt **Docker** & **Docker Compose**

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` tại thư mục gốc và cấu hình các biến sau:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:root@localhost:5432/postgres?schema=public"
JWT_SECRET="your_secret_key"
```

### 4. Khởi chạy Database (Docker)
Sử dụng Docker Compose để chạy PostgreSQL (PostGIS) và pgAdmin:
```bash
docker-compose up -d
```

### 5. Cấu hình Database Schema (Prisma)
Chạy migration để tạo các bảng trong database:
```bash
npx prisma migrate dev --name init
```

### 6. Chạy ứng dụng
Chế độ phát triển (với nodemon):
```bash
npm run dev
```

Chế độ production:
```bash
npm start
```

## Danh sách API chính

### Xác thực (Auth)
- `POST /api/auth/register`: Đăng ký tài khoản
- `POST /api/auth/login`: Đăng nhập

### Bất động sản (Property)
- `GET /api/property`: Xem danh sách tin (công khai)
- `GET /api/property/nearby`: Tìm kiếm tin xung quanh vị trí hiện tại
- `POST /api/property`: Đăng tin mới (Yêu cầu đăng nhập)
- `GET /api/property/my`: Xem tin của tôi

### Yêu thích (Favorite)
- `POST /api/favorite/:propertyId`: Thêm vào yêu thích
- `GET /api/favorite`: Xem danh sách yêu thích
