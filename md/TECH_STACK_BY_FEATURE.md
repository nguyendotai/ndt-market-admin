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
| App shell | Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Lucide React | `src/app`, `src/components/layout`, `src/components/ui` | Layout admin gom sidebar, header, content |
| Admin menu | Config-driven menu, Lucide React, Next Link | `src/configs/menu.ts`, `src/components/layout/admin-sidebar.tsx` | Sidebar sinh menu theo module va active theo URL |
| Header | TailwindCSS, Lucide React, shadcn Button, next-themes | `src/components/layout/admin-header.tsx`, `src/components/theme/theme-toggle.tsx` | Co search, theme toggle, thong bao, user menu |
| Theme | next-themes, Tailwind dark mode, shadcn CSS variables | `src/providers/ThemeProvider.tsx`, `src/components/theme`, `src/app/globals.css` | Dark mode dung class strategy |
| Toast | Sonner | `src/providers/AppProvider.tsx` | Toaster dat o root provider |
| State management | Redux Toolkit, React Redux | `src/store` | Store typed voi `RootState`, `AppDispatch` |
| API client | RTK Query, Axios, `NEXT_PUBLIC_API_URL`, Zod env validation | `src/services/baseApi.ts`, `src/lib/axios.ts`, `src/configs/env.ts`, `.env.example` | RTK Query cho data fetching, Axios client san sang cho service rieng |
| Form validation | React Hook Form, Zod, `@hookform/resolvers` | `src/modules/products/schemas`, `src/lib/validators.ts` | Schema mau cho product form da chuyen vao module products |
| Dashboard overview | React Server Components, TailwindCSS, Lucide React | `src/modules/dashboard` | Du lieu hien tai dang la mock UI |

## Template Cho Chuc Nang Moi

| Chuc nang | Cong nghe su dung | File/folder lien quan | Ghi chu |
| --- | --- | --- | --- |
| Ten chuc nang | Thu vien/cong nghe | `path/to/files` | Ly do/endpoint/state/form neu co |
