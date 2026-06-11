# Module CMS

Module CMS cơ bản quản lý banner và bài viết cho website.

## Banner model

Model banner gồm:

- `title`
- `imageUrl`
- `linkUrl`
- `position`: `HOME_TOP`, `HOME_MIDDLE`, `CATEGORY`, `POPUP`
- `startDate`
- `endDate`
- `status`: `ACTIVE`, `INACTIVE`
- `sortOrder`

## ArticleCategory model

Model danh mục bài viết gồm:

- `name`
- `slug`

Slug được tự động tạo từ `name`.

## Article model

Model bài viết gồm:

- `title`
- `slug`
- `thumbnail`
- `content`
- `excerpt`
- `category`
- `author`
- `status`: `DRAFT`, `PUBLISHED`
- `publishedAt`

Slug được tự động tạo từ `title`.

## API public

- `GET /api/v1/banners`: Lấy banner active và còn hiệu lực.
- `GET /api/v1/articles`: Lấy danh sách bài viết đã published.
- `GET /api/v1/articles/:slug`: Lấy chi tiết bài viết đã published theo slug.

## API quản trị

- `POST /api/v1/admin/banners`: Tạo banner.
- `PATCH /api/v1/admin/banners/:id`: Cập nhật banner.
- `DELETE /api/v1/admin/banners/:id`: Xóa banner.
- `POST /api/v1/admin/article-categories`: Tạo danh mục bài viết.
- `POST /api/v1/admin/articles`: Tạo bài viết.
- `PATCH /api/v1/admin/articles/:id`: Cập nhật bài viết.
- `DELETE /api/v1/admin/articles/:id`: Xóa bài viết.

## Quy tắc nghiệp vụ

- Public banner chỉ trả banner `ACTIVE`, có `startDate <= now` và `endDate >= now`.
- Public article chỉ trả bài viết có `status = PUBLISHED`.
- Slug của article category và article là unique.
