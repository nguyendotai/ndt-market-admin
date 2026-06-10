# Module Sản Phẩm

Module Product quản lý sản phẩm, biến thể sản phẩm và hình ảnh sản phẩm cho website siêu thị online.

## Product model

Model sản phẩm gồm:

- `category`: Danh mục sản phẩm.
- `brand`: Thương hiệu sản phẩm.
- `name`: Tên sản phẩm.
- `slug`: Slug tự động tạo từ `name` và phải unique.
- `sku`: Mã SKU, dùng để search và phải unique.
- `description`: Mô tả đầy đủ.
- `shortDescription`: Mô tả ngắn.
- `unit`: Đơn vị bán.
- `origin`: Xuất xứ.
- `ingredients`: Thành phần.
- `storageInstruction`: Hướng dẫn bảo quản.
- `status`: `DRAFT`, `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`.
- `tags`: Tag phục vụ tìm kiếm/nhóm sản phẩm.
- `soldCount`: Số lượng đã bán.
- `ratingAverage`: Điểm đánh giá trung bình.
- `ratingCount`: Số lượt đánh giá.

## ProductVariant model

Model biến thể gồm:

- `product`
- `name`
- `barcode`
- `price`
- `salePrice`
- `weight`
- `unit`
- `status`

## ProductImage model

Model hình ảnh gồm:

- `product`
- `imageUrl`
- `isThumbnail`
- `sortOrder`

## API public

- `GET /api/v1/products`: Lấy danh sách sản phẩm active, có pagination, filter và search nâng cao.
- `GET /api/v1/products/:slug`: Lấy chi tiết sản phẩm active theo slug.
- `GET /api/v1/products/:slug/related`: Lấy sản phẩm liên quan theo cùng danh mục.

Query của `GET /products`:

- `keyword`: Search theo `name`, `sku`, `description`.
- `category`: Lọc theo category id hoặc slug.
- `brand`: Lọc theo brand id hoặc slug.
- `minPrice`: Giá thấp nhất theo variant.
- `maxPrice`: Giá cao nhất theo variant.
- `origin`: Lọc theo xuất xứ.
- `tags`: Lọc theo tag, hỗ trợ chuỗi phân tách bằng dấu phẩy.
- `rating`: Lọc sản phẩm có `ratingAverage` lớn hơn hoặc bằng giá trị này.
- `inStock`: Nếu là `true`, chỉ trả sản phẩm còn hàng.
- `storeId`: Nếu truyền, chỉ trả sản phẩm còn hàng tại store đó.
- `sort`: `newest`, `price_asc`, `price_desc`, `best_selling`, `rating`.
- `page`: Trang hiện tại.
- `limit`: Số item mỗi trang.

Response danh sách có `meta` pagination gồm `page`, `limit`, `total`, `totalPages`.

## API quản trị

Các route quản trị nằm dưới `/api/v1/admin/products`.

- `POST /admin/products`: Tạo sản phẩm.
- `PATCH /admin/products/:id`: Cập nhật sản phẩm.
- `DELETE /admin/products/:id`: Xóa sản phẩm, đồng thời xóa variants và images liên quan.
- `POST /admin/products/:id/variants`: Tạo biến thể cho sản phẩm.
- `PATCH /admin/products/variants/:variantId`: Cập nhật biến thể.
- `DELETE /admin/products/variants/:variantId`: Xóa biến thể.
- `POST /admin/products/:id/images`: Thêm hình ảnh sản phẩm.
- `DELETE /admin/products/images/:imageId`: Xóa hình ảnh sản phẩm.

## Populate dữ liệu

API public populate `category`, `brand`, `variants` và `images` để frontend có đủ dữ liệu hiển thị.
