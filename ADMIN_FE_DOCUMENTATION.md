# Admin FE Documentation

Tai lieu nay mo ta frontend Admin Dashboard cho NDT Market. Muc tieu la giup contributor moi nam nhanh tech stack, cau truc du an, cach tao module va cac luong chinh dang duoc dung.

## 1. Tech Stack

- Framework: Next.js App Router 16.x
- Language: TypeScript
- UI styling: TailwindCSS v4
- UI components: shadcn/ui style components trong `src/components/ui`
- Icons: lucide-react
- State management: Redux Toolkit + React Redux
- API client: Axios instance
- Form: React Hook Form
- Validation: Zod + `@hookform/resolvers`
- Toast: Sonner
- Theme: next-themes
- Charts: Recharts
- Utility class merge: clsx + tailwind-merge

Ghi chu theo feature duoc quan ly tai `md/TECH_STACK_BY_FEATURE.md`.

## 2. Cau Truc Thu Muc

```txt
src/
+-- app/                 # Next.js App Router routes
|   +-- login/
|   +-- admin/
+-- components/
|   +-- ui/              # shadcn/ui base components
|   +-- common/          # reusable app components
|   +-- layout/          # admin layout, sidebar, header
|   +-- forms/
+-- configs/
|   +-- env.ts           # doc/env mapping
|   +-- menu.ts          # admin menu + permission metadata
+-- constants/           # roles, order/payment status
+-- hooks/
+-- lib/
|   +-- axios.ts         # axios instance + interceptors
|   +-- utils.ts
|   +-- formatters.ts
|   +-- validators.ts
+-- providers/           # ReduxProvider, ThemeProvider
+-- store/               # redux store, hooks, slices
+-- services/            # backend service layer
+-- modules/             # module-based feature code
+-- types/
```

Moi module theo format:

```txt
src/modules/<module>/
+-- components/
+-- pages/
+-- services/
+-- schemas/
+-- types.ts
+-- index.ts
```

Thu muc `md/` dung cho tai lieu ky thuat va ghi chu backend/frontend theo module.

## 3. Cach Chay Du An

```bash
npm install
npm run dev
```

Mac dinh Next.js chay o:

```txt
http://localhost:3000
```

Neu cong 3000 dang co server khac, Next.js co the chay sang cong 3001. Khi do backend CORS can cho phep origin tuong ung, vi du `http://localhost:3001`.

Lenh khac:

```bash
npm run lint
npm run build
npm run start
```

## 4. Cau Hinh Env

File mau: `.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Frontend doc base URL tu `NEXT_PUBLIC_API_URL` va cau hinh axios trong `src/lib/axios.ts`.

Vi du local:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 5. Quy Tac Dat Ten File

- Route file Next.js: `page.tsx`, `layout.tsx`.
- Dynamic route theo backend:
  - Detail product dung slug: `src/app/admin/products/[slug]/page.tsx`
  - Edit product dung slug: `src/app/admin/products/[slug]/edit/page.tsx`
  - Cac module con lai neu backend dang dung id thi dung `[id]`.
- Page component: `ProductsPage.tsx`, `OrdersPage.tsx`.
- Modal component: `BrandFormModal.tsx`, `InventoryImportModal.tsx`.
- Form/schema: `<module>.schema.ts`, vi du `brand.schema.ts`.
- Service: `<module>.service.ts`, vi du `product.service.ts`.
- Type chung cua module: `types.ts`.
- Component React dung PascalCase.
- Hook dung prefix `use`, vi du `useAppSelector`.
- Constant dung UPPER_CASE khi la gia tri co dinh.

## 6. Quy Tac Tao Module Moi

1. Tao folder module:

```txt
src/modules/<module>/
+-- components/
+-- pages/
+-- schemas/
+-- types.ts
+-- index.ts
```

2. Tao route:

```txt
src/app/admin/<route>/page.tsx
```

3. Tao service API:

```txt
src/services/<module>.service.ts
```

4. Them menu tai:

```txt
src/configs/menu.ts
```

Menu nen khai bao `requiredRoles` hoac `requiredPermissions`.

5. Form dung React Hook Form + Zod.

6. Table nen dung common UI san co:

- `PageHeader`
- `DataTable`
- `StatusBadge`
- `ConfirmDialog`
- `AppPagination`
- loading skeleton
- empty state

7. Cap nhat `md/TECH_STACK_BY_FEATURE.md` trong cung change.

## 7. Luong Authentication

1. User vao `/login`.
2. Login form goi `POST /auth/login`.
3. Login thanh cong:
   - luu `accessToken` vao localStorage.
   - luu user vao Redux auth slice.
   - redirect ve route admin can vao.
4. `AuthGuard` kiem tra token va goi `GET /auth/me`.
5. Chi user co role sau moi vao admin:
   - `SUPER_ADMIN`
   - `ADMIN`
   - `STAFF`
6. User da login khong duoc vao lai `/login`.
7. Logout goi `POST /auth/logout` neu backend ho tro, sau do clear token va Redux state.
8. Gap 401 thi axios interceptor clear token va redirect ve `/login`.

File lien quan:

- `src/app/login/page.tsx`
- `src/modules/auth/components/AuthGuard.tsx`
- `src/modules/auth/components/AdminRouteGuard.tsx`
- `src/store/slices/authSlice.ts`
- `src/services/auth.service.ts`
- `src/lib/axios.ts`

## 8. Luong Goi API

Tat ca service dung axios instance:

```txt
src/lib/axios.ts
```

Quy tac:

- `baseURL` lay tu `NEXT_PUBLIC_API_URL`.
- Request interceptor gan header:

```txt
Authorization: Bearer <accessToken>
```

- Response interceptor xu ly loi 401, 403, 500.
- Backend response chuan dang:

```ts
{
  success: boolean;
  message: string;
  data: unknown;
  meta?: unknown;
}
```

- Helper normalize response nam o:

```txt
src/services/api-response.ts
```

- Page/module bat loi API va hien toast bang Sonner.

## 9. Quy Tac Permission Guard

Permission duoc quan ly o:

- `src/modules/auth/access-control.ts`
- `src/modules/auth/components/RoleGuard.tsx`
- `src/modules/auth/components/PermissionGuard.tsx`
- `src/modules/auth/components/AdminRouteGuard.tsx`
- `src/components/common/access-denied.tsx`
- `src/configs/menu.ts`

Quy tac:

- `SUPER_ADMIN` luon co toan quyen.
- `ADMIN` va `STAFF` chi thay menu neu du role/permission.
- Sidebar an menu khong du quyen.
- Page admin bi chan neu khong du quyen va hien trang 403.
- Menu support:

```ts
requiredRoles?: UserRole[];
requiredPermissions?: string[];
```

Vi du:

- Products: `product.view`
- Orders: `order.view`
- Users: `user.view`
- Settings: `SUPER_ADMIN`

## 10. Danh Sach Route Admin

- `/admin`
- `/admin/dashboard`
- `/admin/categories`
- `/admin/brands`
- `/admin/products`
- `/admin/products/create`
- `/admin/products/[slug]`
- `/admin/products/[slug]/edit`
- `/admin/stores`
- `/admin/inventories`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/payments`
- `/admin/reviews`
- `/admin/promotions`
- `/admin/coupons`
- `/admin/banners`
- `/admin/articles`
- `/admin/articles/create`
- `/admin/articles/[id]/edit`
- `/admin/article-categories`
- `/admin/users`
- `/admin/users/[id]`
- `/admin/settings`
- `/admin/[module]` placeholder route

Public route:

- `/login`

## 11. Danh Sach Module Da Build

- Auth
- Dashboard overview
- Users
- Categories
- Brands
- Products
- Stores
- Inventories
- Orders
- Payments
- Reviews
- Promotions
- Coupons
- Banners
- Articles
- Article categories
- Settings
- Permission guard
- Shared admin layout/components

## 12. Cac API Backend Dang Dung

### Auth

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/change-password`
- `PATCH /auth/profile`

### Dashboard

- Hien tai dung mock service cho overview neu backend chua co API thong ke.

### Categories

- `GET /categories`
- `GET /categories/tree`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`
- `DELETE /admin/categories/:id`

### Brands

- `GET /brands`
- `POST /admin/brands`
- `PATCH /admin/brands/:id`
- `DELETE /admin/brands/:id`

### Products

- `GET /products`
- `GET /products/:slug`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/products/:productId/variants`
- `PATCH /admin/products/variants/:variantId`
- `DELETE /admin/products/variants/:variantId`
- `POST /admin/products/:productId/images`
- `DELETE /admin/products/images/:imageId`

### Stores

- `GET /stores`
- `POST /admin/stores`
- `PATCH /admin/stores/:id`
- `DELETE /admin/stores/:id`

### Inventories

- `GET /admin/inventories`
- `PATCH /admin/inventories/:id`
- `POST /admin/inventories/import`
- `POST /admin/inventories/adjust`
- `GET /admin/inventories/movements`

### Orders

- `GET /admin/orders`
- `GET /admin/orders/:id`
- `PATCH /admin/orders/:id/status`

### Payments

- `GET /admin/payments`
- `PATCH /admin/payments/:id/confirm`
- `PATCH /admin/payments/:id/refund`
- `GET /payments/:orderCode`

Neu `GET /admin/payments` chua co, FE co fallback lay tu orders va map payment info.

### Reviews

- `GET /admin/reviews`
- `PATCH /admin/reviews/:id/status`

### Promotions

- `GET /promotions`
- `POST /admin/promotions`
- `PATCH /admin/promotions/:id`
- `DELETE /admin/promotions/:id`

### Coupons

- `GET /admin/coupons`
- `POST /admin/coupons`
- `PATCH /admin/coupons/:id`
- `DELETE /admin/coupons/:id`

### Banners

- `GET /banners`
- `POST /admin/banners`
- `PATCH /admin/banners/:id`
- `DELETE /admin/banners/:id`

### Articles

- `GET /articles`
- `GET /articles/:id`
- `POST /admin/articles`
- `PATCH /admin/articles/:id`
- `DELETE /admin/articles/:id`
- `GET /article-categories`
- `POST /admin/article-categories`

### Users

- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id/status`
- `PATCH /admin/users/:id/role`

FE co fallback sang:

- `GET /users`
- `GET /users/:id`

### Settings

- `GET /admin/settings/store`
- `PATCH /admin/settings/store`
- `GET /admin/settings/system`
- `PATCH /admin/settings/system`

### Upload

- `POST /uploads/image`

## 13. Cac Phan Dang Mock Hoac Cho Backend

- Dashboard overview: dang dung mock service cho doanh thu, don hang, customer, product, chart 7 ngay va order status chart. Can thay bang API thong ke that khi backend co.
- Payments: neu backend chua co `GET /admin/payments`, FE fallback lay danh sach order va map payment info.
- Users: neu backend chua co `/admin/users`, FE fallback sang `/users`.
- Settings profile/store/system: mot so thao tac co fallback local khi backend tra 404/chua ho tro.
- Inventory stock movements: FE da co hook goi `GET /admin/inventories/movements`, neu backend chua co thi hien empty state.
- Articles: editor hien tai la textarea/editor noi bo co preview; neu can rich editor day du co the thay bang Tiptap hoac React Quill.
- Article categories: FE co route/module tao category bai viet, can dam bao backend ho tro day du CRUD neu muon quan tri hoan chinh.
