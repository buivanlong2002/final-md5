# Hệ thống quản lý sản phẩm - Đại lý Clothing

Hệ thống quản lý sản phẩm được xây dựng bằng React và JSON Server để quản lý thông tin sản phẩm quần áo.

## Tính năng chính

### 1. Hiển thị danh sách sản phẩm (35 điểm)
- ✅ Hiển thị đầy đủ thông tin sản phẩm
- ✅ Ngày nhập hiển thị đúng định dạng dd/MM/yyyy (5 điểm)
- ✅ Danh sách sản phẩm sắp xếp tăng dần theo số lượng (5 điểm)
- ✅ Phân trang với 5 sản phẩm mỗi trang

### 2. Cập nhật thông tin sản phẩm (30 điểm)
- ✅ Hiển thị giá trị ban đầu khi vào trang cập nhật (2 điểm)
- ✅ Tên sản phẩm không dài quá 100 ký tự (2 điểm)
- ✅ Thể loại được chọn từ dropdown list (2 điểm)
- ✅ Ngày nhập không được lớn hơn ngày hiện tại (2 điểm)
- ✅ Số lượng phải là số nguyên lớn hơn 0 (2 điểm)
- ✅ Thông báo thành công bằng react-toastify (5 điểm)
- ✅ Lưu thông tin vào file db.json

### 3. Tìm kiếm sản phẩm (25 điểm)
- ✅ Tìm kiếm gần đúng theo tên sản phẩm (5 điểm)
- ✅ Tìm kiếm theo thể loại (5 điểm)
- ✅ Tìm kiếm kết hợp cả 2 thông tin (10 điểm)
- ✅ Hiển thị thông báo "Không tìm thấy sản phẩm" (5 điểm)

### 4. Giao diện và Clean Code (10 điểm)
- ✅ Giao diện toàn màn hình máy tính, tối ưu không gian (5 điểm)
- ✅ Clean code, code có cấu trúc rõ ràng (5 điểm)
- ✅ Responsive design cho mobile và desktop
- ✅ Phân trang với 5 sản phẩm mỗi trang

## Cài đặt và chạy

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Chạy JSON Server (API)
```bash
npm run server
```
Server sẽ chạy tại: http://localhost:3001

### Bước 3: Chạy ứng dụng React
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

## Cấu trúc dự án

```
my-react-app/
├── src/
│   ├── components/
│   │   ├── ProductList.jsx      # Component hiển thị danh sách sản phẩm
│   │   ├── ProductList.css      # CSS cho ProductList
│   │   ├── ProductEdit.jsx      # Component cập nhật sản phẩm
│   │   └── ProductEdit.css      # CSS cho ProductEdit
│   ├── App.jsx                  # Component chính
│   ├── App.css                  # CSS chính
│   └── main.jsx                 # Entry point
├── db.json                      # Database JSON
├── package.json                 # Dependencies và scripts
└── README.md                    # Hướng dẫn sử dụng
```

## API Endpoints

- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy thông tin sản phẩm theo ID
- `PUT /products/:id` - Cập nhật sản phẩm
- `GET /categories` - Lấy danh sách loại sản phẩm

## Dữ liệu mẫu

Hệ thống đã có sẵn dữ liệu mẫu với 15 sản phẩm và 4 loại sản phẩm:
- Áo
- Quần
- Váy
- Áo khoác

## Công nghệ sử dụng

- **React 19** - Framework frontend
- **React Router** - Routing
- **JSON Server** - Mock API
- **React Toastify** - Thông báo toast
- **CSS3** - Styling với responsive design
- **Vite** - Build tool

## Tác giả

Hệ thống được phát triển cho bài tập quản lý sản phẩm đại lý Clothing.
