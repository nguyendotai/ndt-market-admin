# Module Khuyến Mãi Và Coupon

Module Promotion và Coupon quản lý chương trình khuyến mãi, mã giảm giá và lượt sử dụng coupon.

## Promotion model

Model promotion gồm:

- `name`
- `type`: `PRODUCT_DISCOUNT`, `ORDER_DISCOUNT`, `BUY_X_GET_Y`
- `discountType`: `PERCENT`, `FIXED`
- `discountValue`
- `minOrderValue`
- `maxDiscount`
- `startDate`
- `endDate`
- `status`: `ACTIVE`, `INACTIVE`

## PromotionProduct model

Model liên kết promotion với biến thể sản phẩm gồm:

- `promotion`
- `variant`

## Coupon model

Model coupon gồm:

- `code`
- `discountType`
- `discountValue`
- `minOrderValue`
- `maxDiscount`
- `usageLimit`
- `usedCount`
- `userLimit`
- `expiredAt`
- `status`

## CouponUsage model

Model lượt dùng coupon gồm:

- `coupon`
- `user`
- `order`

## API Promotion

API public:

- `GET /api/v1/promotions`: Lấy danh sách promotion active và còn hiệu lực.

API quản trị:

- `POST /api/v1/admin/promotions`: Tạo promotion.
- `PATCH /api/v1/admin/promotions/:id`: Cập nhật promotion.
- `DELETE /api/v1/admin/promotions/:id`: Xóa promotion.

## API Coupon

API khách hàng:

- `POST /api/v1/coupons/apply`: Kiểm tra coupon và trả về `discountAmount`.

API quản trị:

- `POST /api/v1/admin/coupons`: Tạo coupon.
- `GET /api/v1/admin/coupons`: Lấy danh sách coupon.
- `PATCH /api/v1/admin/coupons/:id`: Cập nhật coupon.
- `DELETE /api/v1/admin/coupons/:id`: Xóa coupon.

## Quy tắc nghiệp vụ

- Coupon phải active và chưa hết hạn.
- `orderValue` phải đạt `minOrderValue`.
- Nếu có `usageLimit`, `usedCount` không được vượt giới hạn.
- Số lần user dùng coupon không được vượt `userLimit`.
- Discount được tính theo `PERCENT` hoặc `FIXED`.
- Nếu có `maxDiscount`, `discountAmount` không vượt quá `maxDiscount`.
- `discountAmount` không vượt quá giá trị đơn hàng.
