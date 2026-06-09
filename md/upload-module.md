# Module Upload Ảnh

Module upload ảnh dùng `multer` để validate file và upload trực tiếp lên Cloudinary.

## API

- `POST /api/v1/uploads/image`: Upload một ảnh.

Request dạng `multipart/form-data`:

- `image`: File ảnh.
- `folder`: `product`, `category`, `brand`, `banner`, `article`, `avatar`, hoặc `review`.

Response:

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://res.cloudinary.com/.../image/upload/..."
  }
}
```

## Quy tắc upload

- Chỉ cho phép file `jpg`, `jpeg`, `png`, `webp`.
- Dung lượng tối đa là `5MB`.
- File không lưu local trong thư mục `/uploads`.
- Ảnh được lưu trên Cloudinary theo folder `ndt-market/<folder>`.
- Các field lưu ảnh trong hệ thống như `category.image`, `brand.logo`, `product imageUrl`, `banner.imageUrl`, `article.thumbnail`, `user.avatar` và `review.images` nên lưu URL Cloudinary trả về từ API upload.

## Phân quyền

- Admin và Super Admin được upload ảnh `product`, `category`, `brand`, `banner`, `article`.
- Người dùng đã đăng nhập được upload `avatar` và `review`.
- Route yêu cầu đăng nhập.

## Cấu hình môi trường

Các biến Cloudinary cần có trong `.env`:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
