# Dự Án Bất Động Sản 3D (Laravel 11 + Three.js + XAMPP)

Hệ thống website bất động sản tương tác 3D WebGL với kiến trúc decoupled: Backend Laravel 11 REST API và Frontend Single Page Application (SPA) sử dụng Vite + Three.js.

---

## 1. Cấu Trúc Mã Nguồn (Source Code Architecture)

```
real-estate-3D/
├── backend/                                   # Laravel 11 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Controller.php
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php            # Đăng ký, đăng nhập, hồ sơ cá nhân
│   │   │   │       ├── PropertyController.php        # Danh sách, bộ lọc, chi tiết BĐS kèm 3D
│   │   │   │       ├── FavoriteController.php        # Lưu/xóa BĐS yêu thích
│   │   │   │       ├── InquiryController.php         # Gửi thông tin/đặt lịch xem
│   │   │   │       └── Admin/
│   │   │   │           ├── PropertyAdminController.php # CRUD BĐS & ảnh
│   │   │   │           ├── ModelUploadController.php   # Tải lên file .glb, tọa độ camera, hotspots
│   │   │   │           ├── UserAdminController.php     # Phân quyền admin/customer
│   │   │   │           └── InquiryAdminController.php  # Xử lý trạng thái yêu cầu/lịch xem
│   │   │   ├── Middleware/
│   │   │   │   └── RoleMiddleware.php                # Kiểm tra quyền 'admin' / 'customer'
│   │   │   └── Requests/                             # Form Requests xác thực dữ liệu
│   │   │       ├── LoginRequest.php
│   │   │       ├── RegisterRequest.php
│   │   │       ├── PropertyRequest.php
│   │   │       ├── ModelUploadRequest.php
│   │   │       └── InquiryRequest.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── PropertyType.php
│   │   │   ├── Property.php
│   │   │   ├── PropertyModel3D.php                   # Quản lý file .glb, camera_json, hotspots
│   │   │   ├── PropertyHotspot.php                   # Điểm ghim tọa độ 3D (x, y, z)
│   │   │   ├── PropertyImage.php
│   │   │   ├── Favorite.php
│   │   │   └── Inquiry.php
│   │   └── Services/
│   │       ├── PropertyService.php                   # Tìm kiếm, lọc nâng cao, tạo slug
│   │       └── FileService.php                       # Quản lý lưu trữ .glb, ảnh vào storage/public
│   ├── bootstrap/app.php                             # Cấu hình routes & middleware (Laravel 11)
│   ├── config/                                       # Cấu hình CORS, filesystems, database
│   ├── database/
│   │   ├── migrations/                               # 9 Migration schemas đầy đủ quan hệ DB
│   │   └── seeders/DatabaseSeeder.php                # Dữ liệu mẫu (Admin, Customer, Types, Model 3D)
│   ├── public/                                       # Web root cho XAMPP Apache
│   │   ├── index.php
│   │   └── .htaccess                                 # MIME type model/gltf-binary .glb & rewrite rules
│   ├── routes/
│   │   ├── api.php                                   # Toàn bộ REST API routes
│   │   └── web.php
│   ├── storage/app/public/
│   │   ├── models/                                   # Nơi lưu file 3D (.glb, .gltf)
│   │   └── images/                                   # Nơi lưu ảnh BĐS
│   ├── .env.example
│   └── composer.json
│
└── frontend/                                  # SPA (Vite + Three.js)
    ├── public/
    │   └── draco/                                    # Thư mục chứa Draco decoder
    ├── src/
    │   ├── api/                                      # Axios HTTP Client & API modules
    │   │   ├── axios.js                              # Interceptor tự động gắn Bearer Token
    │   │   ├── auth.js
    │   │   ├── properties.js
    │   │   ├── inquiries.js
    │   │   └── admin.js
    │   ├── three/                                    # Bộ điều khiển đồ họa 3D Three.js
    │   │   ├── SceneManager.js                       # Render loop, renderer, camera, shadows, ánh sáng
    │   │   ├── ModelLoader.js                        # GLTFLoader + DRACOLoader + auto fit to box
    │   │   ├── Controls.js                           # OrbitControls (xoay 360°) & Walkthrough (đi bộ WASD)
    │   │   ├── Hotspots.js                           # Điểm ghim 3D phát sáng, hiệu ứng sóng xung mạch
    │   │   └── Picking.js                            # Raycaster tương tác click chọn phòng / hotspot
    │   ├── store/
    │   │   └── auth.js                               # Lưu trữ Reactive Auth State & LocalStorage
    │   ├── router/
    │   │   └── index.js                              # SPA router kèm Navigation Guard phân quyền
    │   ├── pages/
    │   │   ├── Home.js                               # Trang chủ giới thiệu
    │   │   ├── PropertyList.js                       # Danh sách BĐS kèm bộ lọc
    │   │   ├── PropertyDetail3D.js                   # Màn hình trải nghiệm 3D toàn cảnh & sidebar
    │   │   ├── Login.js                              # Đăng nhập
    │   │   ├── Register.js                           # Đăng ký
    │   │   └── admin/                                # Khu vực quản trị
    │   │       ├── Dashboard.js                      # Thống kê & quản lý danh sách BĐS
    │   │       ├── PropertyForm.js                   # Thêm BĐS mới
    │   │       ├── UploadModel.js                    # Upload file .glb & gắn Hotspots
    │   │       ├── Users.js                          # Quản lý người dùng & phân quyền
    │   │       └── Inquiries.js                      # Quản lý yêu cầu xem nhà & cập nhật trạng thái
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── HotspotModal.js                       # Modal hiển thị thông tin khi nhấp hotspot
    │   │   └── WalkthroughHelp.js                    # Bảng hướng dẫn phím bấm di chuyển
    │   ├── styles/
    │   │   └── main.css                              # Giao diện Dark modern UI
    │   └── main.js                                   # Điểm khởi chạy ứng dụng
    ├── index.html
    ├── package.json
    └── vite.config.js                                # Cấu hình proxy sang backend Laravel
```

---

## 2. Hướng Dẫn Cài Đặt & Chạy Môi Trường XAMPP

### Bước 1: Backend Laravel
1. Mở terminal vào thư mục `backend/`:
   ```bash
   cd backend
   composer install
   ```
2. Cấu hình cơ sở dữ liệu trong `backend/.env` (đã tạo sẵn kết nối MySQL XAMPP `realestate3d`).
3. Khởi động MySQL trong XAMPP Control Panel và tạo database `realestate3d`:
   ```sql
   CREATE DATABASE realestate3d CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Chạy migration và seeder mẫu:
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   ```
5. Chạy backend server (hoặc trỏ VirtualHost Apache vào `backend/public`):
   ```bash
   php artisan serve --port=8000
   ```

### Tài khoản mẫu đã seed sẵn:
- **Quản trị viên (Admin)**: `admin@realestate3d.vn` / `admin123`
- **Khách hàng (Customer)**: `customer@gmail.com` / `password123`

### Dữ liệu dự án Nha Trang
Seeder thêm 10 hồ sơ dự án để hiển thị trên trang chủ và danh sách bất động sản: Panorama Nha Trang, Gold Coast Nha Trang, Scenia Bay Nha Trang, The Costa Nha Trang Residences, The Aston Luxury Residence Nha Trang, Libera Nha Trang, Ariyana SmartCondotel Nha Trang, VCN Phước Long, Mỹ Gia và Lê Hồng Phong II.

Đây là hồ sơ tổng quan dự án, không đại diện cho một căn cụ thể. Giá bán, diện tích, ảnh và mô hình 3D được để trống nếu chưa có dữ liệu xác thực; các dự án này mở trang thông tin thay vì hiển thị mô hình 3D mẫu. Khi cập nhật dự án hiện có, chạy `php artisan migrate --seed` trong thư mục `backend/`.

---

### Bước 2: Frontend Vite + Three.js
1. Mở terminal vào thư mục `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Chạy server phát triển Vite:
   ```bash
   npm run dev
   ```
3. Truy cập trình duyệt: `http://localhost:5173`.
