# Tech Stack By Feature

Tai lieu nay dung de theo doi cong nghe duoc su dung theo tung chuc nang cua Admin Dashboard.

Khi them moi hoac thay doi cong nghe cho bat ky chuc nang nao, hay cap nhat bang ben duoi trong cung PR/commit voi code thay doi.

## Quy Uoc Cap Nhat

- Ghi ro ten chuc nang hoac module.
- Ghi ro thu vien/framework/cong nghe duoc dung.
- Ghi ro file/folder lien quan de nguoi sau de truy vet.
- Neu thay the cong nghe cu, ghi ly do ngan gon trong cot ghi chu.
- Neu chuc nang co API, ghi ro endpoint group hoac RTK Query slice lien quan.

## Bang Theo Doi

| Chuc nang | Cong nghe su dung | File/folder lien quan | Ghi chu |
| --- | --- | --- | --- |
| Module architecture | Next.js App Router, module-based architecture | `src/modules`, `src/app/admin`, `src/app/login` | Moi module theo format `components`, `pages`, `services`, `schemas`, `types.ts`, `index.ts` |
| Auth | React Hook Form, Zod, Redux Toolkit, Axios interceptor, Sonner toast | `src/modules/auth`, `src/store/slices/authSlice.ts`, `src/lib/axios.ts`, `src/app/login/page.tsx`, `src/app/admin/layout.tsx` | Login `/auth/login`, me `/auth/me`, logout `/auth/logout`; guard chi cho ADMIN, STAFF, SUPER_ADMIN |
| App shell | Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Lucide React | `src/app`, `src/components/layout`, `src/components/ui` | Layout admin gom sidebar, header, content |
| Admin menu | Config-driven menu, Lucide React, Next Link | `src/configs/menu.ts`, `src/components/layout/admin-sidebar.tsx` | Sidebar sinh menu theo module va active theo URL |
| Header | TailwindCSS, Lucide React, shadcn Button, next-themes | `src/components/layout/admin-header.tsx`, `src/components/theme/theme-toggle.tsx` | Co search, theme toggle, thong bao, user menu |
| Admin UI primitives | shadcn/ui style, Lucide React, TailwindCSS | `src/components/common/breadcrumb.tsx`, `src/components/common/page-header.tsx`, `src/components/common/data-table.tsx`, `src/components/common/confirm-dialog.tsx`, `src/components/common/status-badge.tsx`, `src/components/common/user-dropdown.tsx` | Bo component dung lai cho Breadcrumb, PageHeader, DataTable, ConfirmDialog, StatusBadge, UserDropdown |
| UI states | App Router loading, DataTable loading/empty/error states | `src/app/admin/loading.tsx`, `src/components/common/data-table.tsx` | Loading route-level va state trong bang du lieu |
| Theme | next-themes, Tailwind dark mode, shadcn CSS variables | `src/providers/ThemeProvider.tsx`, `src/components/theme`, `src/app/globals.css` | Dark mode dung class strategy |
| Toast | Sonner | `src/providers/AppProvider.tsx` | Toaster dat o root provider |
| State management | Redux Toolkit, React Redux | `src/store` | Store typed voi `RootState`, `AppDispatch` |
| API client | RTK Query, Axios, `NEXT_PUBLIC_API_URL`, Zod env validation | `src/services/baseApi.ts`, `src/lib/axios.ts`, `src/configs/env.ts`, `.env.example` | RTK Query cho data fetching, Axios client san sang cho service rieng |
| Service layer | Axios instance, CRUD service factory, normalized backend response | `src/lib/axios.ts`, `src/services/api-response.ts`, `src/services/crud-service.ts`, `src/services/*.service.ts` | BaseURL tu `NEXT_PUBLIC_API_URL`, Bearer token interceptor, response error 401/403/500, helper response `{ success, message, data, meta }` |
| Form validation | React Hook Form, Zod, `@hookform/resolvers` | `src/modules/products/schemas`, `src/lib/validators.ts` | Schema mau cho product form da chuyen vao module products |
| Dashboard overview | React Server Components, TailwindCSS, Lucide React | `src/modules/dashboard` | Du lieu hien tai dang la mock UI |
| Dashboard overview route | Next.js App Router, Recharts, shadcn-style Card/Badge/Table, mock dashboard service | `src/app/admin/dashboard/page.tsx`, `src/modules/dashboard/pages/DashboardPage.tsx`, `src/modules/dashboard/components/DashboardCharts.tsx`, `src/services/dashboard.service.ts` | Route `/admin/dashboard`; mock service can thay bang API that khi backend co thong ke |
| Categories management | React Hook Form, Zod, Axios service, shadcn-style Card/Table/Badge, Sonner toast | `src/app/admin/categories/page.tsx`, `src/modules/categories`, `src/services/category.service.ts`, `src/services/upload.service.ts` | Quan ly danh muc cha/con theo `parent`, search, filter active, create/edit/delete, auto slug, toggle active, upload image qua `POST /api/v1/uploads/image` voi folder `category` |
| Brands management | React Hook Form, Zod, Axios service, shadcn-style Card/Table/Badge, Sonner toast | `src/app/admin/brands/page.tsx`, `src/modules/brands`, `src/services/brand.service.ts`, `src/services/upload.service.ts` | Quan ly thuong hieu, search, create/edit/delete, auto slug, toggle active, preview/upload logo qua folder `brand` |
| Products management | React Hook Form, Zod, Axios service, shadcn-style Card/Table/Badge, Sonner toast | `src/app/admin/products`, `src/modules/products`, `src/services/product.service.ts`, `src/services/upload.service.ts` | Quan ly san pham, filter category/brand/status, sort, pagination, create/edit/detail, variants, images, upload product images |

## Template Cho Chuc Nang Moi

| Chuc nang | Cong nghe su dung | File/folder lien quan | Ghi chu |
| --- | --- | --- | --- |
| Ten chuc nang | Thu vien/cong nghe | `path/to/files` | Ly do/endpoint/state/form neu co |
