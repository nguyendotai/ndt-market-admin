# Module Cửa Hàng Và Tồn Kho

Module Store và Inventory quản lý cửa hàng, tồn kho theo biến thể sản phẩm và lịch sử biến động kho.

## Store Model

Model cửa hàng gồm:

- `name`
- `phone`
- `province`
- `district`
- `ward`
- `address`
- `latitude`
- `longitude`
- `openingHours`
- `status`: `ACTIVE`, `INACTIVE`

## Inventory Model

Model tồn kho gồm:

- `store`: Cửa hàng.
- `variant`: Biến thể sản phẩm.
- `quantity`: Tổng số lượng tồn vật lý.
- `reservedQuantity`: Số lượng đang được giữ chỗ cho đơn hàng.

Tồn kho có thể bán được:

```text
availableQuantity = quantity - reservedQuantity
```

Nếu `availableQuantity <= 5`, API trả `stockStatus: "LOW_STOCK"` để UI hiển thị badge cảnh báo sắp hết hàng. Các trường hợp còn lại trả `stockStatus: "IN_STOCK"`.

## StockMovement Model

Model lịch sử biến động kho gồm:

- `store`
- `variant`
- `type`: `IMPORT`, `EXPORT`, `ADJUST`, `RESERVE`, `RELEASE`
- `quantity`
- `reason`
- `createdBy`

## API Cửa Hàng

API public:

- `GET /api/v1/stores`: Lấy danh sách cửa hàng đang active.
- `GET /api/v1/stores/nearby`: Lấy cửa hàng gần vị trí người dùng.

API quản trị:

- `POST /api/v1/admin/stores`: Tạo cửa hàng.
- `PATCH /api/v1/admin/stores/:id`: Cập nhật cửa hàng.
- `DELETE /api/v1/admin/stores/:id`: Xóa cửa hàng.

## API Tồn Kho Cho UI Admin

Tất cả API quản trị tồn kho nằm dưới `/api/v1/admin/inventories` và yêu cầu permission `inventory.manage`.

### Table Tồn Kho

Endpoint:

- `GET /api/v1/admin/inventories`

Query:

- `storeId`: Lọc theo cửa hàng.
- `variantId`: Lọc theo biến thể.
- `keyword`: Search theo tên sản phẩm, SKU, tên biến thể hoặc barcode.
- `search`: Alias của `keyword`.
- `lowStock`: Nếu là `true`, chỉ trả dòng có `availableQuantity <= 5`.

Response mỗi dòng hỗ trợ UI hiển thị:

```json
{
  "_id": "665f00000000000000000001",
  "productName": "Rau muống sạch",
  "productSku": "NDT-RAU-MUONG-001",
  "variantName": "500g",
  "barcode": "893000000001",
  "storeName": "NDT Market Quận 1",
  "quantity": 20,
  "reservedQuantity": 3,
  "availableQuantity": 17,
  "stockStatus": "IN_STOCK",
  "product": {},
  "variant": {},
  "store": {}
}
```

UI nên hiển thị các cột:

- Product name.
- Variant.
- Store.
- Quantity.
- Reserved quantity.
- Available quantity.
- Badge `LOW_STOCK` nếu `stockStatus` là `LOW_STOCK`.

### Modal Nhập Kho

Endpoint:

- `POST /api/v1/admin/inventories/import`

Body:

```json
{
  "store": "665f00000000000000000010",
  "variant": "665f00000000000000000020",
  "quantity": 20,
  "reason": "Nhập hàng đầu ngày"
}
```

Quy tắc:

- `quantity` phải là số nguyên dương.
- Nếu chưa có inventory cho store và variant, backend tự tạo mới.
- Tạo stock movement type `IMPORT`.

### Modal Điều Chỉnh Kho

Endpoint:

- `POST /api/v1/admin/inventories/adjust`

Body:

```json
{
  "store": "665f00000000000000000010",
  "variant": "665f00000000000000000020",
  "quantity": -2,
  "reason": "Điều chỉnh sau kiểm kho"
}
```

Quy tắc:

- `quantity` có thể dương hoặc âm nhưng không được bằng `0`.
- Không cho phép điều chỉnh khiến `quantity < reservedQuantity`.
- Tạo stock movement type `ADJUST`.

### Cập Nhật Tồn Kho Trực Tiếp

Endpoint:

- `PATCH /api/v1/admin/inventories/:id`

Body:

```json
{
  "quantity": 30,
  "reservedQuantity": 2
}
```

Quy tắc:

- Không cho phép `reservedQuantity > quantity`.

### Lịch Sử Stock Movement

Endpoint:

- `GET /api/v1/admin/inventories/movements`

Query:

- `storeId`: Lọc theo cửa hàng.
- `variantId`: Lọc theo biến thể.
- `type`: `IMPORT`, `EXPORT`, `ADJUST`, `RESERVE`, `RELEASE`.
- `keyword`: Search theo tên sản phẩm, SKU, tên biến thể hoặc barcode.
- `search`: Alias của `keyword`.

Response mỗi dòng:

```json
{
  "_id": "665f00000000000000000030",
  "productName": "Rau muống sạch",
  "productSku": "NDT-RAU-MUONG-001",
  "variantName": "500g",
  "barcode": "893000000001",
  "storeName": "NDT Market Quận 1",
  "type": "IMPORT",
  "quantity": 20,
  "reason": "Nhập hàng đầu ngày",
  "createdBy": {
    "_id": "665f00000000000000000040",
    "fullName": "Admin"
  },
  "createdAt": "2026-06-10T00:00:00.000Z"
}
```

## API Public Tồn Kho

- `GET /api/v1/products/:variantId/inventory?storeId=`: Kiểm tra tồn kho của một biến thể sản phẩm.

## API Nội Bộ Cho Đơn Hàng

- `POST /api/v1/admin/inventories/reserve`: Giữ chỗ tồn kho khi đặt hàng.
- `POST /api/v1/admin/inventories/release`: Hoàn lại tồn kho giữ chỗ khi hủy đơn.

## Quy Tắc Nghiệp Vụ

- Khi đặt hàng, hệ thống gọi `reserveStock` để tăng `reservedQuantity`.
- Khi hủy đơn, hệ thống gọi `releaseStock` để giảm `reservedQuantity`.
- Không cho phép `reservedQuantity` lớn hơn `quantity`.
- Không cho phép điều chỉnh khiến `quantity` nhỏ hơn `reservedQuantity`.
- `availableQuantity = quantity - reservedQuantity`.
- `LOW_STOCK` khi `availableQuantity <= 5`.
