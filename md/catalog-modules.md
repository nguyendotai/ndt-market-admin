# Module Danh Mục Và Thương Hiệu

Tài liệu này ghi nhận các module Category và Brand cho website siêu thị online.

## Category

Model category gồm:

- `parent`: Danh mục cha, có thể rỗng.
- `name`: Tên danh mục.
- `slug`: Slug được tự động tạo từ `name` và phải unique.
- `image`: Hình ảnh danh mục.
- `sortOrder`: Thứ tự hiển thị.
- `isActive`: Trạng thái hiển thị public.

API public:

- `GET /api/v1/categories`: Lấy danh sách danh mục đang active.
- `GET /api/v1/categories/tree`: Lấy cây danh mục đang active.
- `GET /api/v1/categories/:slug`: Lấy chi tiết danh mục đang active theo slug.

API quản trị:

- `POST /api/v1/admin/categories`: Tạo danh mục.
- `PATCH /api/v1/admin/categories/:id`: Cập nhật danh mục.
- `DELETE /api/v1/admin/categories/:id`: Xóa danh mục.

## Brand

Model brand gồm:

- `name`: Tên thương hiệu.
- `slug`: Slug được tự động tạo từ `name` và phải unique.
- `logo`: Logo thương hiệu.
- `description`: Mô tả thương hiệu.
- `isActive`: Trạng thái hiển thị public.

API public:

- `GET /api/v1/brands`: Lấy danh sách thương hiệu đang active.
- `GET /api/v1/brands/:slug`: Lấy chi tiết thương hiệu đang active theo slug.

API quản trị:

- `POST /api/v1/admin/brands`: Tạo thương hiệu.
- `PATCH /api/v1/admin/brands/:id`: Cập nhật thương hiệu.
- `DELETE /api/v1/admin/brands/:id`: Xóa thương hiệu.

## Phân quyền

Các API public chỉ trả item có `isActive = true`.

Các API quản trị yêu cầu đăng nhập và role `ADMIN` hoặc `SUPER_ADMIN`.
